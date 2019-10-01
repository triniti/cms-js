import { actionChannel, call, delay, fork, putResolve, race } from 'redux-saga/effects';
import { channel } from 'redux-saga';
import GalleryV1Mixin from '@triniti/schemas/triniti/curator/mixin/gallery/GalleryV1Mixin';
import moment from 'moment';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import OperationTimedOut from '@triniti/cms/plugins/pbjx/exceptions/OperationTimedOut';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SearchGalleriesRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-galleries-request/SearchGalleriesRequestV1Mixin';
import test from 'tape';
import toast from '@triniti/admin-ui-plugin/utils/toast';
import publishNodeFlow from './publishNodeFlow';
import changeNodeFlow, { failureFlow, successFlow } from './changeNodeFlow';
import sagaDeepEqual from './sagaDeepEqual';
import waitForFlow from './waitForFlow';
import waitForMyEvent from './waitForMyEvent';

const config = {
  schemas: {
    getNodeRequest: resolveSchema(GalleryV1Mixin, 'request', 'get-gallery-request'),
    publishNode: resolveSchema(GalleryV1Mixin, 'command', 'publish-gallery'),
    node: GalleryV1Mixin.findOne(),
    nodePublished: resolveSchema(GalleryV1Mixin, 'event', 'gallery-published'),
    nodeScheduled: resolveSchema(GalleryV1Mixin, 'event', 'gallery-scheduled'),
    searchNodes: SearchGalleriesRequestV1Mixin.findOne(),
  },
};

const fakeNode = GalleryV1Mixin.findOne().createMessage();
const publishAction = {
  config,
  pbj: config.schemas.publishNode.createMessage().set('node_ref', NodeRef.fromNode(fakeNode)),
};
const scheduleAction = {
  config,
  pbj: config.schemas.publishNode.createMessage()
    .set('node_ref', NodeRef.fromNode(fakeNode))
    .set('publish_at', moment().add(1, 'year').toDate()),
};

const verify = () => {};

const publishFailureMessage = 'Publish Gallery failed: ';
const publishSuccessMessage = 'Success! The Gallery was published.';
const publishNodeFlowConfig = {
  expectedEvent: publishAction.config.schemas.nodePublished.getCurie().toString(),
  failureMessage: publishFailureMessage,
  getNodeRequestSchema: publishAction.config.schemas.getNodeRequest,
  pbj: publishAction.pbj,
  successMessage: publishSuccessMessage,
  verify,
};

const scheduleFailureMessage = 'Schedule Gallery failed: ';
const scheduleSuccessMessage = 'Success! The Gallery was scheduled.';
const scheduleNodeFlowConfig = {
  expectedEvent: publishAction.config.schemas.nodeScheduled.getCurie().toString(),
  failureMessage: scheduleFailureMessage,
  getNodeRequestSchema: publishAction.config.schemas.getNodeRequest,
  pbj: scheduleAction.pbj,
  successMessage: scheduleSuccessMessage,
  verify,
};

test('Ncr:saga:publishNodeFlow:publish', (t) => {
  const generator = publishNodeFlow(publishAction);
  let next = generator.next();

  const actual = next.value;
  const expected = call(changeNodeFlow, publishNodeFlowConfig);

  t.true(sagaDeepEqual(actual, expected), 'it should call changeNodeFlow with the correct config');

  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:publishNodeFlow:schedule', (t) => {
  const generator = publishNodeFlow(scheduleAction);
  let next = generator.next();

  const actual = next.value;
  const expected = call(changeNodeFlow, scheduleNodeFlowConfig);

  t.true(sagaDeepEqual(actual, expected), 'it should call changeNodeFlow with the correct config');

  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:publishNodeFlow:publish:changeNodeFlow[success]', (t) => {
  const generator = changeNodeFlow(publishNodeFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = publishAction.config.schemas.nodePublished.getCurie().toString();
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
  expected = putResolve(publishAction.pbj);
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
    publishAction.config.schemas.getNodeRequest,
    publishAction.pbj.get('node_ref'),
    verify,
  );
  t.deepEqual(actual, expected, 'it should call the waitForFlow with the correct arguments.');
  next = generator.next(true);

  actual = next.value;
  expected = call(successFlow, publishSuccessMessage, undefined);
  t.true(sagaDeepEqual(actual, expected, 'it should call successFlow with the correct arguments.'));
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:publishNodeFlow:schedule:changeNodeFlow[success]', (t) => {
  const generator = changeNodeFlow(scheduleNodeFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = scheduleAction.config.schemas.nodeScheduled.getCurie().toString();
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
  expected = putResolve(scheduleAction.pbj);
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
    scheduleAction.config.schemas.getNodeRequest,
    scheduleAction.pbj.get('node_ref'),
    verify,
  );
  t.deepEqual(actual, expected, 'it should call the waitForFlow with the correct arguments.');
  next = generator.next(true);

  actual = next.value;
  expected = call(successFlow, scheduleSuccessMessage, undefined);
  t.true(sagaDeepEqual(actual, expected, 'it should call successFlow with the correct arguments after getting the expected event.'));
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:publishNodeFlow:publish:changeNodeFlow[success:waitForFlow]', (t) => {
  const generator = changeNodeFlow(publishNodeFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = publishAction.config.schemas.nodePublished.getCurie().toString();
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
  expected = putResolve(publishAction.pbj);
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
    publishAction.config.schemas.getNodeRequest,
    publishAction.pbj.get('node_ref'),
    verify,
  );
  t.deepEqual(actual, expected, 'it should call the waitForFlow with the correct arguments after timing out.');
  next = generator.next(true);

  actual = next.value;
  expected = call(successFlow, publishSuccessMessage, undefined);
  t.true(sagaDeepEqual(actual, expected, 'it should call successFlow with the correct arguments after getting the expected event.'));
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:publishNodeFlow:schedule:changeNodeFlow[success:waitForFlow]', (t) => {
  const generator = changeNodeFlow(scheduleNodeFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = scheduleAction.config.schemas.nodeScheduled.getCurie().toString();
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
  expected = putResolve(scheduleAction.pbj);
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
    scheduleAction.config.schemas.getNodeRequest,
    scheduleAction.pbj.get('node_ref'),
    verify,
  );
  t.deepEqual(actual, expected, 'it should call the waitForFlow with the correct arguments after timing out.');
  next = generator.next(true);

  actual = next.value;
  expected = call(successFlow, scheduleSuccessMessage, undefined);
  t.true(sagaDeepEqual(actual, expected, 'it should call successFlow with the correct arguments after getting the expected event.'));
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:publishNodeFlow:publish:changeNodeFlow[failure:waitForFlow]', (t) => {
  const generator = changeNodeFlow(publishNodeFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = publishAction.config.schemas.nodePublished.getCurie().toString();
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
  expected = putResolve(publishAction.pbj);
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
    publishAction.config.schemas.getNodeRequest,
    publishAction.pbj.get('node_ref'),
    verify,
  );
  t.deepEqual(actual, expected, 'it should call the waitForFlow with the correct arguments after timing out.');
  next = generator.next(false);

  actual = next.value;
  expected = call(
    failureFlow,
    publishFailureMessage,
    new OperationTimedOut(publishAction.pbj),
    undefined,
  );
  t.true(sagaDeepEqual(actual, expected), 'it should call the failureFlow after not getting a valid node from waitForFlow');
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:publishNodeFlow:schedule:changeNodeFlow[failure:waitForFlow]', (t) => {
  const generator = changeNodeFlow(scheduleNodeFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = scheduleAction.config.schemas.nodeScheduled.getCurie().toString();
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
  expected = putResolve(scheduleAction.pbj);
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
    scheduleAction.config.schemas.getNodeRequest,
    scheduleAction.pbj.get('node_ref'),
    verify,
  );
  t.deepEqual(actual, expected, 'it should call the waitForFlow with the correct arguments after timing out.');
  next = generator.next(false);

  actual = next.value;
  expected = call(
    failureFlow,
    scheduleFailureMessage,
    new OperationTimedOut(scheduleAction.pbj),
    undefined,
  );
  t.true(sagaDeepEqual(actual, expected), 'it should call the failureFlow after not getting a valid node from waitForFlow');
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:publishNodeFlow:publish:changeNodeFlow[failure:thrown]', (t) => {
  const generator = changeNodeFlow(publishNodeFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = publishAction.config.schemas.nodePublished.getCurie().toString();
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
  expected = call(failureFlow, publishFailureMessage, error, undefined);
  t.true(sagaDeepEqual(actual, expected), 'it should call failureFlow with the correct arguments when catching an error');
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:publishNodeFlow:schedule:changeNodeFlow[failure:thrown]', (t) => {
  const generator = changeNodeFlow(scheduleNodeFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = scheduleAction.config.schemas.nodeScheduled.getCurie().toString();
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
  expected = call(failureFlow, scheduleFailureMessage, error, undefined);
  t.true(sagaDeepEqual(actual, expected), 'it should call failureFlow with the correct arguments when catching an error');
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});
