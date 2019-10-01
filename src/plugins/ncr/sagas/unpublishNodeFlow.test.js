import { actionChannel, call, delay, fork, putResolve, race } from 'redux-saga/effects';
import { channel } from 'redux-saga';
import GalleryV1Mixin from '@triniti/schemas/triniti/curator/mixin/gallery/GalleryV1Mixin';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import OperationTimedOut from '@triniti/cms/plugins/pbjx/exceptions/OperationTimedOut';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SearchGalleriesRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-galleries-request/SearchGalleriesRequestV1Mixin';
import test from 'tape';
import toast from '@triniti/admin-ui-plugin/utils/toast';
import unpublishNodeFlow from './unpublishNodeFlow';
import changeNodeFlow, { failureFlow, successFlow } from './changeNodeFlow';
import sagaDeepEqual from './sagaDeepEqual';
import waitForFlow from './waitForFlow';
import waitForMyEvent from './waitForMyEvent';

const config = {
  schemas: {
    getNodeRequest: resolveSchema(GalleryV1Mixin, 'request', 'get-gallery-request'),
    unpublishNode: resolveSchema(GalleryV1Mixin, 'command', 'unpublish-gallery'),
    node: GalleryV1Mixin.findOne(),
    nodeUnpublished: resolveSchema(GalleryV1Mixin, 'event', 'gallery-unpublished'),
    searchNodes: SearchGalleriesRequestV1Mixin.findOne(),
  },
};

const fakeNode = GalleryV1Mixin.findOne().createMessage();
const unpublishAction = {
  config,
  pbj: config.schemas.unpublishNode.createMessage().set('node_ref', NodeRef.fromNode(fakeNode)),
};

const verify = () => {};

const failureMessage = 'Unpublish Gallery failed: ';
const successMessage = 'Success! The Gallery was unpublished.';
const unpublishNodeFlowConfig = {
  expectedEvent: unpublishAction.config.schemas.nodeUnpublished.getCurie().toString(),
  failureMessage,
  getNodeRequestSchema: unpublishAction.config.schemas.getNodeRequest,
  pbj: unpublishAction.pbj,
  successMessage,
  verify,
};

test('Ncr:saga:unpublishNodeFlow', (t) => {
  const generator = unpublishNodeFlow(unpublishAction);
  let next = generator.next();

  const actual = next.value;
  const expected = call(changeNodeFlow, unpublishNodeFlowConfig);

  t.true(sagaDeepEqual(actual, expected), 'it should call changeNodeFlow with the correct config');

  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:unpublishNodeFlow:changeNodeFlow[success]', (t) => {
  const generator = changeNodeFlow(unpublishNodeFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = unpublishAction.config.schemas.nodeUnpublished.getCurie().toString();
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
  expected = putResolve(unpublishAction.pbj);
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
    unpublishAction.config.schemas.getNodeRequest,
    unpublishAction.pbj.get('node_ref'),
    verify,
  );
  t.deepEqual(actual, expected, 'it should call the waitForFlow with the correct arguments.');
  next = generator.next(true);

  actual = next.value;
  expected = call(successFlow, successMessage, undefined);
  t.true(sagaDeepEqual(actual, expected, 'it should call successFlow with the correct arguments after getting the expected event.'));
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:unpublishNodeFlow:changeNodeFlow[failure:waitForFlow]', (t) => {
  const generator = changeNodeFlow(unpublishNodeFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = unpublishAction.config.schemas.nodeUnpublished.getCurie().toString();
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
  expected = putResolve(unpublishAction.pbj);
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
    unpublishAction.config.schemas.getNodeRequest,
    unpublishAction.pbj.get('node_ref'),
    verify,
  );
  t.deepEqual(actual, expected, 'it should call the waitForFlow with the correct arguments after timing out.');
  next = generator.next(false);

  actual = next.value;
  expected = call(
    failureFlow,
    failureMessage,
    new OperationTimedOut(unpublishAction.pbj),
    undefined,
  );
  t.true(sagaDeepEqual(actual, expected), 'it should call the failureFlow after not getting a valid node from waitForFlow');
  next = generator.next();

  t.true(next.done, 'it should be done');
  t.end();
});

test('Ncr:saga:unpublishNodeFlow:changeNodeFlow[failure:thrown]', (t) => {
  const generator = changeNodeFlow(unpublishNodeFlowConfig);
  let next = generator.next();

  let actual = next.value;
  let expected = fork([toast, 'show']);
  t.deepEqual(
    actual,
    expected,
    'it should create a toast.',
  );
  next = generator.next();

  const expectedEvent = unpublishAction.config.schemas.nodeUnpublished.getCurie().toString();
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
