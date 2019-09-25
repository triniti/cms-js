import { actionChannel, call, delay, fork, putResolve, race } from 'redux-saga/effects';
import { channel } from 'redux-saga';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import OperationTimedOut from '@triniti/cms/plugins/pbjx/exceptions/OperationTimedOut';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SearchTeasersRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-teasers-request/SearchTeasersRequestV1Mixin';
import TeaserV1Mixin from '@triniti/schemas/triniti/curator/mixin/teaser/TeaserV1Mixin';
import test from 'tape';
import toast from '@triniti/admin-ui-plugin/utils/toast';
import markNodeAsDraftFlow from './markNodeAsDraftFlow';
import changeNodeFlow, { failureFlow, successFlow } from './changeNodeFlow';
import sagaDeepEqual from './sagaDeepEqual';
import waitForFlow from './waitForFlow';
import waitForMyEvent from './waitForMyEvent';

const config = {
  schemas: {
    getNodeRequest: resolveSchema(TeaserV1Mixin, 'request', 'get-teaser-request'),
    markNodeAsDraft: resolveSchema(TeaserV1Mixin, 'command', 'mark-teaser-as-draft'),
    node: TeaserV1Mixin.findAll().find((mixin) => mixin.getCurie().getMessage().includes('youtube')),
    nodeMarkedAsDraft: resolveSchema(TeaserV1Mixin, 'event', 'teaser-marked-as-draft'),
    searchNodes: SearchTeasersRequestV1Mixin.findOne(),
  },
};

const fakeNode = TeaserV1Mixin.findAll().find((mixin) => mixin.getCurie().getMessage().includes('youtube')).createMessage();
const action = {
  config,
  pbj: config.schemas.markNodeAsDraft.createMessage().set('node_ref', NodeRef.fromNode(fakeNode)),
};

const verify = () => {};

const failureMessage = 'Mark Youtube Video Teaser as draft failed: ';
const successMessage = 'Success! The Youtube Video Teaser was marked as draft.';
const markNodeAsDraftFlowConfig = {
  expectedEvent: action.config.schemas.nodeMarkedAsDraft.getCurie().toString(),
  failureMessage,
  getNodeRequestSchema: action.config.schemas.getNodeRequest,
  pbj: action.pbj,
  successMessage,
  verify,
};

test('Ncr:saga:markNodeAsDraftFlow', (t) => {
  const generator = markNodeAsDraftFlow(action);
  let next = generator.next();

  const actual = next.value;
  const expected = call(changeNodeFlow, markNodeAsDraftFlowConfig);

  t.true(sagaDeepEqual(actual, expected), 'it should call changeNodeFlow with the correct config');

  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:markNodeAsDraftFlow:changeNodeFlow[success]', (t) => {
  const generator = changeNodeFlow(markNodeAsDraftFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = action.config.schemas.nodeMarkedAsDraft.getCurie().toString();
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
    action.pbj.get('node_ref'),
    verify,
  );
  t.deepEqual(actual, expected, 'it should call the waitForFlow with the correct arguments.');
  next = generator.next(true);

  actual = next.value;
  expected = call(successFlow, successMessage, undefined);
  t.true(sagaDeepEqual(actual, expected, 'it should call successFlow with the correct arguments.'));
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:markNodeAsDraftFlow:changeNodeFlow[failure:waitForFlow]', (t) => {
  const generator = changeNodeFlow(markNodeAsDraftFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = action.config.schemas.nodeMarkedAsDraft.getCurie().toString();
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
    action.pbj.get('node_ref'),
    verify,
  );
  t.deepEqual(actual, expected, 'it should call the waitForFlow with the correct arguments after timing out.');
  next = generator.next(false);

  actual = next.value;
  expected = call(
    failureFlow,
    failureMessage,
    new OperationTimedOut(action.pbj),
    undefined,
  );
  t.true(sagaDeepEqual(actual, expected), 'it should call the failureFlow after not getting a valid node from waitForFlow');
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:markNodeAsDraftFlow:changeNodeFlow[failure:thrown]', (t) => {
  const generator = changeNodeFlow(markNodeAsDraftFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = action.config.schemas.nodeMarkedAsDraft.getCurie().toString();
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
  expected = call(failureFlow, failureMessage, error, undefined);
  t.true(sagaDeepEqual(actual, expected), 'it should call failureFlow with the correct arguments when catching an error');
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});
