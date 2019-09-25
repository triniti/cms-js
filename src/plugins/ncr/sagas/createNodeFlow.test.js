import { actionChannel, call, delay, fork, put, putResolve, race } from 'redux-saga/effects';
import { channel } from 'redux-saga';
import { reset, SubmissionError } from 'redux-form';
import ArticleV1Mixin from '@triniti/schemas/triniti/news/mixin/article/ArticleV1Mixin';
import clearResponse from '@triniti/cms/plugins/pbjx/actions/clearResponse';
import Code from '@gdbots/schemas/gdbots/pbjx/enums/Code';
import destroyEditor from '@triniti/cms/plugins/blocksmith/actions/destroyEditor';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import OperationTimedOut from '@triniti/cms/plugins/pbjx/exceptions/OperationTimedOut';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SearchArticlesRequestV1Mixin from '@triniti/schemas/triniti/news/mixin/search-articles-request/SearchArticlesRequestV1Mixin';
import test from 'tape';
import toast from '@triniti/admin-ui-plugin/utils/toast';
import createNodeFlow, { onAfterFailureFlow as realOnAfterFailureFlow, onAfterSuccessFlow as realOnAfterSuccessFlow } from './createNodeFlow';
import changeNodeFlow, { failureFlow, successFlow } from './changeNodeFlow';
import sagaDeepEqual from './sagaDeepEqual';
import waitForFlow from './waitForFlow';
import waitForMyEvent from './waitForMyEvent';

const config = {
  schemas: {
    createNode: resolveSchema(ArticleV1Mixin, 'command', 'create-article'),
    getNodeRequest: resolveSchema(ArticleV1Mixin, 'request', 'get-article-request'),
    node: ArticleV1Mixin.findOne(),
    nodeCreated: resolveSchema(ArticleV1Mixin, 'event', 'article-created'),
    searchNodes: SearchArticlesRequestV1Mixin.findOne(),
  },
};

const fakeNode = ArticleV1Mixin.findOne().createMessage();
const action = {
  config,
  pbj: config.schemas.createNode.createMessage().set('node', fakeNode),
};

function* onAfterFailureFlow() {
  yield call(() => { console.log('i am inert'); });
}

function* onAfterSuccessFlow() {
  yield call(() => { console.log('i am inert'); });
}

const verify = () => {};

const failureMessage = 'Create Article failed: ';
const successMessage = 'Success! The Article was created.';
const changeNodeFlowConfig = {
  expectedEvent: action.config.schemas.nodeCreated.getCurie().toString(),
  failureMessage,
  getNodeRequestSchema: action.config.schemas.getNodeRequest,
  onAfterFailureFlow: (error) => onAfterFailureFlow(action, error),
  onAfterSuccessFlow: () => onAfterSuccessFlow(action),
  pbj: action.pbj,
  successMessage,
  verify,
};

test('Ncr:saga:createNodeFlow', (t) => {
  const generator = createNodeFlow(action);
  let next = generator.next();

  const actual = next.value;
  const expected = call(changeNodeFlow, changeNodeFlowConfig);

  t.true(sagaDeepEqual(actual, expected), 'it should call changeNodeFlow with the correct config');

  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:createNodeFlow:changeNodeFlow[success]', (t) => {
  const generator = changeNodeFlow(changeNodeFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = action.config.schemas.nodeCreated.getCurie().toString();
  actual = next.value;
  expected = actionChannel(expectedEvent);
  t.deepEqual(
    actual,
    expected,
    'it should create expected event action channel.',
  );
  const mockChannel = channel();
  next = generator.next(mockChannel);

  actual = next.value;
  expected = putResolve(action.pbj);
  t.deepEqual(
    actual,
    expected,
    'it should dispatch the pbj.',
  );
  next = generator.next();

  actual = next.value;
  expected = race({
    event: call(waitForMyEvent, mockChannel),
    timeout: delay(1000),
  });
  t.true(sagaDeepEqual(actual, expected), 'a race between incoming event and timeout should be created');
  next = generator.next({ event: true });

  actual = next.value;
  expected = call(
    waitForFlow,
    action.config.schemas.getNodeRequest,
    NodeRef.fromNode(action.pbj.get('node')),
    verify,
  );
  t.deepEqual(actual, expected, 'it should call the waitForFlow with the correct arguments.');
  next = generator.next(true);

  actual = next.value;
  expected = call(successFlow, successMessage, onAfterSuccessFlow);
  t.true(sagaDeepEqual(actual, expected, 'it should call successFlow with the correct arguments after getting the expected event.'));
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:createNodeFlow:changeNodeFlow[failure:waitForFlow]', (t) => {
  const generator = changeNodeFlow(changeNodeFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = action.config.schemas.nodeCreated.getCurie().toString();
  actual = next.value;
  expected = actionChannel(expectedEvent);
  t.deepEqual(
    actual,
    expected,
    'it should create expected event action channel.',
  );
  const mockChannel = channel();
  next = generator.next(mockChannel);

  actual = next.value;
  expected = putResolve(action.pbj);
  t.deepEqual(
    actual,
    expected,
    'it should dispatch the pbj.',
  );
  next = generator.next();

  actual = next.value;
  expected = race({
    event: call(waitForMyEvent, mockChannel),
    timeout: delay(1000),
  });
  t.true(sagaDeepEqual(actual, expected), 'a race between incoming event and timeout should be created');
  next = generator.next({ timeout: true });

  actual = next.value;
  expected = call(
    waitForFlow,
    action.config.schemas.getNodeRequest,
    NodeRef.fromNode(action.pbj.get('node')),
    verify,
  );
  t.deepEqual(actual, expected, 'it should call the waitForFlow with the correct arguments after timing out.');
  next = generator.next(false);

  actual = next.value;
  expected = call(
    failureFlow,
    failureMessage,
    new OperationTimedOut(action.pbj),
    onAfterFailureFlow,
  );
  t.true(sagaDeepEqual(actual, expected), 'it should call the failureFlow after not getting a valid node from waitForFlow');
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:createNodeFlow:changeNodeFlow[failure:thrown]', (t) => {
  const generator = changeNodeFlow(changeNodeFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = action.config.schemas.nodeCreated.getCurie().toString();
  actual = next.value;
  expected = actionChannel(expectedEvent);
  t.deepEqual(
    actual,
    expected,
    'it should create expected event action channel.',
  );
  const mockChannel = channel();
  next = generator.next(mockChannel);

  const error = {
    getCode: () => Code.ALREADY_EXISTS.getValue(),
    getMessage: () => 'whatever',
  };
  next = generator.throw(error);

  actual = next.value;
  expected = call(failureFlow, failureMessage, error, onAfterFailureFlow);
  t.true(sagaDeepEqual(actual, expected), 'it should call failureFlow with the correct arguments when catching an error');
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:createNodeFlow:onAfterFailureFlow', (t) => {
  const reject = () => {};
  const error = {
    getMessage: () => 'whatever',
  };
  const generator = realOnAfterFailureFlow({ reject }, error);
  let next = generator.next();

  const actual = next.value;
  const expected = call(reject, new SubmissionError({ _error: 'whatever' }));
  t.deepEqual(
    actual,
    expected,
    'it should reject the form promise',
  );
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:createNodeFlow:onAfterSuccessFlow', (t) => {
  const resolve = () => {};
  const history = {
    push: () => {},
  };
  const theConfig = {
    ...config,
    formName: 'blah',
    updateFormName: 'stillblah',
  };
  const generator = realOnAfterSuccessFlow({
    config: theConfig,
    resolve,
    history,
    pbj: action.pbj,
  });
  let next = generator.next();

  let actual = next.value;
  let expected = call(resolve);
  t.deepEqual(
    actual,
    expected,
    'it should resolve the form promise',
  );
  next = generator.next();

  actual = next.value;
  expected = put(reset(theConfig.formName));
  t.deepEqual(
    actual,
    expected,
    'it should reset the form',
  );
  next = generator.next();

  actual = next.value;
  expected = put(destroyEditor(theConfig.updateFormName));
  t.deepEqual(
    actual,
    expected,
    'it should destroy the blocksmith editor',
  );
  next = generator.next();

  actual = next.value;
  expected = put(clearResponse(config.schemas.searchNodes.getCurie()));
  t.deepEqual(
    actual,
    expected,
    'it should dispatch clearResponse for searchNodes',
  );
  next = generator.next();

  actual = next.value;
  expected = call(history.push, `/news/articles/${fakeNode.get('_id')}/edit`);
  t.deepEqual(
    actual,
    expected,
    'it should redirect to the node\'s edit page',
  );
  next = generator.next();

  actual = next.value;
  expected = put(clearResponse(config.schemas.getNodeRequest.getCurie()));
  t.deepEqual(
    actual,
    expected,
    'it should dispatch clearResponse for getNode',
  );
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});
