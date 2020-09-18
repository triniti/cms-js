import { actionChannel, call, delay, fork, put, putResolve, race } from 'redux-saga/effects';
import { channel } from 'redux-saga';
import { reset, SubmissionError } from 'redux-form';
import ArticleV1Mixin from '@triniti/schemas/triniti/news/mixin/article/ArticleV1Mixin';
import clearResponse from '@triniti/cms/plugins/pbjx/actions/clearResponse';
import destroyEditor from '@triniti/cms/plugins/blocksmith/actions/destroyEditor';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import OperationTimedOut from '@triniti/cms/plugins/pbjx/exceptions/OperationTimedOut';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SearchArticlesRequestV1Mixin from '@triniti/schemas/triniti/news/mixin/search-articles-request/SearchArticlesRequestV1Mixin';
import test from 'tape';
import toast from '@triniti/admin-ui-plugin/utils/toast';
import updateNodeFlow, { onAfterFailureFlow as realOnAfterFailureFlow, onAfterSuccessFlow as realOnAfterSuccessFlow, publishAfterUpdateFlow as realPublishAfterUpdateFlow } from './updateNodeFlow';
import changeNodeFlow, { failureFlow, successFlow } from './changeNodeFlow';
import sagaDeepEqual from './sagaDeepEqual';
import waitForFlow from './waitForFlow';
import waitForMyEvent from './waitForMyEvent';

const config = {
  schemas: {
    getNodeRequest: resolveSchema(ArticleV1Mixin, 'request', 'get-article-request'),
    node: ArticleV1Mixin.findOne(),
    nodePublished: resolveSchema(ArticleV1Mixin, 'event', 'article-published'),
    nodeUpdated: resolveSchema(ArticleV1Mixin, 'event', 'article-updated'),
    publishNode: resolveSchema(ArticleV1Mixin, 'command', 'publish-article'),
    searchNodes: SearchArticlesRequestV1Mixin.findOne(),
    updateNode: resolveSchema(ArticleV1Mixin, 'command', 'update-article'),
  },
};

const fakeNode = ArticleV1Mixin.findOne().createMessage();
const updateNodeAction = {
  config,
  pbj: config.schemas.updateNode.createMessage()
    .set('new_node', fakeNode)
    .set('node_ref', NodeRef.fromNode(fakeNode)),
};
const updateNodeAndCloseAction = {
  config: {
    ...config,
    shouldCloseAfterSave: true,
  },
  pbj: config.schemas.updateNode.createMessage()
    .set('new_node', fakeNode)
    .set('node_ref', NodeRef.fromNode(fakeNode)),
};
const updateAndPublishNodeAction = {
  config: {
    ...config,
    shouldPublishAfterSave: true,
  },
  pbj: config.schemas.updateNode.createMessage()
    .set('new_node', fakeNode)
    .set('node_ref', NodeRef.fromNode(fakeNode)),
};
const publishNodeAction = {
  config,
  pbj: config.schemas.publishNode.createMessage().set('node_ref', NodeRef.fromNode(fakeNode)),
};

function* onAfterFailureFlow() {
  yield call(() => { console.log('i am inert'); });
}

function* onAfterSuccessFlow() {
  yield call(() => { console.log('i am inert'); });
}

function* publishAfterUpdateFlow() {
  yield call(() => { console.log('i am inert'); });
}

const verify = () => {};

const updateNodeFailureMessage = 'Save Article failed: ';
const updateNodeSuccessMessage = 'Success! The Article was saved.';
const updateNodeFlowConfig = {
  expectedEvent: updateNodeAction.config.schemas.nodeUpdated.getCurie().toString(),
  failureMessage: updateNodeFailureMessage,
  getNodeRequestSchema: updateNodeAction.config.schemas.getNodeRequest,
  onAfterFailureFlow: (error) => onAfterFailureFlow(updateNodeAction, error),
  onAfterSuccessFlow: () => onAfterSuccessFlow(updateNodeAction),
  onContinueFlow: null,
  pbj: updateNodeAction.pbj,
  successMessage: updateNodeSuccessMessage,
  toastMessage: null,
  verify,
};

const updateNodeAndCloseFailureMessage = 'Save Article failed: ';
const updateNodeAndCloseSuccessMessage = 'Success! The Article was saved.';
const updateNodeAndCloseFlowConfig = {
  expectedEvent: updateNodeAndCloseAction.config.schemas.nodeUpdated.getCurie().toString(),
  failureMessage: updateNodeAndCloseFailureMessage,
  getNodeRequestSchema: updateNodeAndCloseAction.config.schemas.getNodeRequest,
  onAfterFailureFlow: (error) => onAfterFailureFlow(updateNodeAndCloseAction, error),
  onAfterSuccessFlow: () => onAfterSuccessFlow(updateNodeAndCloseAction),
  onContinueFlow: null,
  pbj: updateNodeAndCloseAction.pbj,
  successMessage: updateNodeAndCloseSuccessMessage,
  toastMessage: null,
  verify,
};

const updateAndPublishNodeFailureMessage = 'Save Article failed: ';
const updateAndPublishNodeSuccessMessage = 'Success! The Article was saved.';
const updateAndPublishNodeFlowConfig = {
  expectedEvent: updateAndPublishNodeAction.config.schemas.nodeUpdated.getCurie().toString(),
  failureMessage: updateAndPublishNodeFailureMessage,
  getNodeRequestSchema: updateAndPublishNodeAction.config.schemas.getNodeRequest,
  onAfterFailureFlow: (error) => onAfterFailureFlow(updateAndPublishNodeAction, error),
  onAfterSuccessFlow: () => onAfterSuccessFlow(updateAndPublishNodeAction),
  onContinueFlow: updateAndPublishNodeAction.config.shouldPublishAfterSave
    ? () => publishAfterUpdateFlow(updateAndPublishNodeAction)
    : null,
  pbj: updateAndPublishNodeAction.pbj,
  successMessage: updateAndPublishNodeSuccessMessage,
  toastMessage: 'Saving...',
  verify,
};

const publishNodeFailureMessage = 'Publish Article failed: ';
const publishNodeSuccessMessage = 'Success! The Article was saved and published.';
const publishNodeFlowConfig = {
  expectedEvent: publishNodeAction.config.schemas.nodePublished.getCurie().toString(),
  failureMessage: publishNodeFailureMessage,
  getNodeRequestSchema: publishNodeAction.config.schemas.getNodeRequest,
  onAfterFailureFlow: (error) => onAfterFailureFlow(publishNodeAction, error),
  onAfterSuccessFlow: () => onAfterSuccessFlow(publishNodeAction),
  pbj: publishNodeAction.pbj,
  successMessage: publishNodeSuccessMessage,
  toastMessage: 'Publishing...',
  verify,
};

test('Ncr:saga:updateNodeFlow:updateNode', (t) => {
  const generator = updateNodeFlow(updateNodeAction);
  let next = generator.next();

  const actual = next.value;
  const expected = call(changeNodeFlow, updateNodeFlowConfig);

  t.true(sagaDeepEqual(actual, expected), 'it should call changeNodeFlow with the correct config');

  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:updateNodeFlow:updateNodeAndClose', (t) => {
  const generator = updateNodeFlow(updateNodeAndCloseAction);
  let next = generator.next();

  const actual = next.value;
  const expected = call(changeNodeFlow, updateNodeAndCloseFlowConfig);

  t.true(sagaDeepEqual(actual, expected), 'it should call changeNodeFlow with the correct config');

  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:updateNodeFlow:updateAndPublishNode', (t) => {
  const generator = updateNodeFlow(updateAndPublishNodeAction);
  let next = generator.next();

  const actual = next.value;
  const expected = call(changeNodeFlow, updateAndPublishNodeFlowConfig);

  t.true(sagaDeepEqual(actual, expected), 'it should call changeNodeFlow with the correct config');

  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:updateNodeFlow:updateNode:changeNodeFlow[success]', (t) => {
  const generator = changeNodeFlow(updateNodeFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = updateNodeAction.config.schemas.nodeUpdated.getCurie().toString();
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
  expected = putResolve(updateNodeAction.pbj);
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
    updateNodeAction.config.schemas.getNodeRequest,
    updateNodeAction.pbj.get('node_ref'),
    verify,
  );
  t.deepEqual(actual, expected, 'it should call the waitForFlow with the correct arguments.');
  next = generator.next(true);

  actual = next.value;
  expected = call(successFlow, updateNodeSuccessMessage, onAfterSuccessFlow);
  t.true(sagaDeepEqual(actual, expected), 'it should call successFlow with the correct arguments after getting the expected event.');
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:updateNodeFlow:updateNodeAndClose:changeNodeFlow[success]', (t) => {
  const generator = changeNodeFlow(updateNodeAndCloseFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = updateNodeAndCloseAction.config.schemas.nodeUpdated.getCurie().toString();
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
  expected = putResolve(updateNodeAndCloseAction.pbj);
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
    updateNodeAndCloseAction.config.schemas.getNodeRequest,
    updateNodeAndCloseAction.pbj.get('node_ref'),
    verify,
  );
  t.deepEqual(actual, expected, 'it should call the waitForFlow with the correct arguments.');
  next = generator.next(true);

  actual = next.value;
  expected = call(successFlow, updateNodeAndCloseSuccessMessage, onAfterSuccessFlow);
  t.true(sagaDeepEqual(actual, expected), 'it should call successFlow with the correct arguments after getting the expected event.');
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:updateNodeFlow:updateNode:changeNodeFlow[failure:waitForFlow]', (t) => {
  const generator = changeNodeFlow(updateNodeFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = updateNodeAction.config.schemas.nodeUpdated.getCurie().toString();
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
  expected = putResolve(updateNodeAction.pbj);
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
    updateNodeAction.config.schemas.getNodeRequest,
    updateNodeAction.pbj.get('node_ref'),
    verify,
  );
  t.deepEqual(actual, expected, 'it should call the waitForFlow with the correct arguments after timing out.');
  next = generator.next(false);

  actual = next.value;
  expected = call(
    failureFlow,
    updateNodeFailureMessage,
    new OperationTimedOut(updateNodeAction.pbj),
    onAfterFailureFlow,
  );
  t.true(sagaDeepEqual(actual, expected), 'it should call the failureFlow after not getting a valid node from waitForFlow');
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:updateNodeFlow:updateNodeAndClose:changeNodeFlow[failure:waitForFlow]', (t) => {
  const generator = changeNodeFlow(updateNodeAndCloseFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = updateNodeAndCloseAction.config.schemas.nodeUpdated.getCurie().toString();
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
  expected = putResolve(updateNodeAndCloseAction.pbj);
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
    updateNodeAndCloseAction.config.schemas.getNodeRequest,
    updateNodeAndCloseAction.pbj.get('node_ref'),
    verify,
  );
  t.deepEqual(actual, expected, 'it should call the waitForFlow with the correct arguments after timing out.');
  next = generator.next(false);

  actual = next.value;
  expected = call(
    failureFlow,
    updateNodeFailureMessage,
    new OperationTimedOut(updateNodeAndCloseAction.pbj),
    onAfterFailureFlow,
  );
  t.true(sagaDeepEqual(actual, expected), 'it should call the failureFlow after not getting a valid node from waitForFlow');
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:updateNodeFlow:updateAndPublishNode:changeNodeFlow[failure:waitForFlow]', (t) => {
  const generator = changeNodeFlow(updateAndPublishNodeFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show'], updateAndPublishNodeFlowConfig.toastMessage);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = updateAndPublishNodeAction.config.schemas.nodeUpdated.getCurie().toString();
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
  expected = putResolve(updateAndPublishNodeAction.pbj);
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
    updateAndPublishNodeAction.config.schemas.getNodeRequest,
    updateAndPublishNodeAction.pbj.get('node_ref'),
    verify,
  );
  t.deepEqual(actual, expected, 'it should call the waitForFlow with the correct arguments after timing out.');
  next = generator.next(false);

  actual = next.value;
  expected = call(
    failureFlow,
    updateNodeFailureMessage,
    new OperationTimedOut(updateAndPublishNodeAction.pbj),
    onAfterFailureFlow,
  );
  t.true(sagaDeepEqual(actual, expected), 'it should call the failureFlow after not getting a valid node from waitForFlow');
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:updateNodeFlow:changeNodeFlow[failure:thrown]', (t) => {
  const generator = changeNodeFlow(updateNodeFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = updateNodeAction.config.schemas.nodeUpdated.getCurie().toString();
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
    getMessage: () => 'whatever',
  };
  next = generator.throw(error);

  actual = next.value;
  expected = call(failureFlow, updateNodeFailureMessage, error, onAfterFailureFlow);
  t.true(sagaDeepEqual(actual, expected), 'it should call failureFlow with the correct arguments when catching an error');
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:updateNodeFlow:onAfterFailureFlow', (t) => {
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

test('Ncr:saga:updateNodeFlow:updateNode:onAfterSuccessFlow', (t) => {
  const resolve = () => {};
  const history = {
    push: () => {},
  };
  const theConfig = {
    ...config,
    formName: 'blah',
  };
  const generator = realOnAfterSuccessFlow({
    config: theConfig,
    resolve,
    history,
    pbj: updateNodeAction.pbj,
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
  expected = put(destroyEditor(theConfig.formName));
  t.deepEqual(
    actual,
    expected,
    'it should destroy the blocksmith editor',
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

  actual = next.value;
  expected = put(clearResponse(config.schemas.searchNodes.getCurie()));
  t.deepEqual(
    actual,
    expected,
    'it should dispatch clearResponse for searchNodes',
  );
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:updateNodeFlow:updateNodeAndClose:onAfterSuccessFlow', (t) => {
  const resolve = () => {};
  const history = {
    push: () => {},
  };
  const theConfig = {
    ...config,
    formName: 'blah',
    shouldCloseAfterSave: true,
  };
  const generator = realOnAfterSuccessFlow({
    config: theConfig,
    match: {
      url: '/ovp/videos/16ea4251-944d-5d75-babe-8de5d82f5b51/edit',
    },
    resolve,
    history,
    pbj: updateNodeAction.pbj,
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
  expected = put(destroyEditor(theConfig.formName));
  t.deepEqual(
    actual,
    expected,
    'it should destroy the blocksmith editor',
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

  actual = next.value;
  expected = put(clearResponse(config.schemas.searchNodes.getCurie()));
  t.deepEqual(
    actual,
    expected,
    'it should dispatch clearResponse for searchNodes',
  );
  next = generator.next();

  actual = next.value;
  expected = call(history.push, '/ovp/videos/');
  t.deepEqual(
    actual,
    expected,
    'it should redirect to the node\'s search page',
  );
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:updateNodeFlow:updateAndPublishNode:publishAfterUpdateFlow', (t) => {
  const generator = realPublishAfterUpdateFlow(publishNodeAction);
  let next = generator.next();

  const actual = next.value;
  const expected = call(changeNodeFlow, publishNodeFlowConfig);

  t.true(sagaDeepEqual(actual, expected), 'it should call changeNodeFlow with the correct config');

  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:updateNodeFlow:updateAndPublishNode:changeNodeFlow[success]', (t) => {
  const generator = changeNodeFlow(updateAndPublishNodeFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show'], updateAndPublishNodeFlowConfig.toastMessage);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = updateAndPublishNodeAction
    .config.schemas.nodeUpdated.getCurie().toString();
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
  expected = putResolve(updateAndPublishNodeAction.pbj);
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
    updateAndPublishNodeAction.config.schemas.getNodeRequest,
    updateAndPublishNodeAction.pbj.get('node_ref'),
    verify,
  );
  t.deepEqual(actual, expected, 'it should call the waitForFlow with the correct arguments.');
  next = generator.next(true);

  actual = next.value;
  expected = call(successFlow, updateAndPublishNodeSuccessMessage, onAfterSuccessFlow);
  t.true(actual, expected, 'it should call successFlow with the correct arguments after getting the expected event.');
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:updateNodeFlow:updateAndPublishNode:changeNodeFlow[failure:waitForFlow]', (t) => {
  const generator = changeNodeFlow(publishNodeFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show'], publishNodeFlowConfig.toastMessage);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = publishNodeAction.config.schemas.nodePublished.getCurie().toString();
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
  expected = putResolve(publishNodeAction.pbj);
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
    publishNodeAction.config.schemas.getNodeRequest,
    publishNodeAction.pbj.get('node_ref'),
    verify,
  );
  t.deepEqual(actual, expected, 'it should call the waitForFlow with the correct arguments after timing out.');
  next = generator.next(false);

  actual = next.value;
  expected = call(
    failureFlow,
    publishNodeFailureMessage,
    new OperationTimedOut(publishNodeAction.pbj),
    onAfterFailureFlow,
  );
  t.true(sagaDeepEqual(actual, expected), 'it should call the failureFlow after not getting a valid node from waitForFlow');
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:updateNodeFlow:updateAndPublishNode:changeNodeFlow[failure:thrown]', (t) => {
  const generator = changeNodeFlow(publishNodeFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show'], publishNodeFlowConfig.toastMessage);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = publishNodeAction.config.schemas.nodePublished.getCurie().toString();
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
    getMessage: () => 'whatever',
  };
  next = generator.throw(error);

  actual = next.value;
  expected = call(failureFlow, publishNodeFailureMessage, error, onAfterFailureFlow);
  t.true(sagaDeepEqual(actual, expected), 'it should call failureFlow with the correct arguments when catching an error');
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});
