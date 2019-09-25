import test from 'tape';
import { call, cancel, cancelled, fork, put, race, select, take } from 'redux-saga/effects';
import { createMockTask } from '@redux-saga/testing-utils';
import isGranted from '@triniti/cms/plugins/iam/selectors/isGranted';
import PageV1Mixin from '@triniti/schemas/triniti/canvas/mixin/page/PageV1Mixin';
import schemas from '@triniti/cms/plugins/canvas/screens/search-pages/schemas';
import sendAlert from '@triniti/admin-ui-plugin/actions/sendAlert';
import deleteNode from '../actions/deleteNode';
import getBatchOperationState from '../selectors/getBatchOperationState';
import getNode from '../selectors/getNode';
import startBatchOperation from '../actions/startBatchOperation';
import batchOperationFlow, {
  batchOperationGenerator,
  doRavenValidation,
  waitForValidationResult,
} from './batchOperationFlow';
import { actionTypes, batchOperationStatuses } from '../constants';

const pageSchema = PageV1Mixin.findOne();
const page1 = pageSchema.createMessage()
  .set('title', 'test1')
  .set('description', 'test1')
  .set('slug', 'test1')
  .set('seo_title', 'test1');

const nodeRefs = [page1.get('_id').toNodeRef()];
const action = {
  type: actionTypes.BATCH_DELETE_NODES_REQUESTED,
  nodeRefs,
  config: {
    nodeSchema: schemas.deleteNode,
    expectedNodeSchema: schemas.nodeDeleted,
    getNodeRequestSchema: schemas.getNodeRequest,
    notGrantedMessage: 'Error: Not authorized to perform batch delete operation.',
    delay: 1000,
  },
};

test('Ncr:saga:batchOperationFlow[Not Authorized]', (t) => {
  const generator = batchOperationFlow(action);
  let actual = generator.next().value;
  let expected = select(isGranted, action.config.nodeSchema.getCurie().toString());
  t.deepEqual(actual, expected, 'it should call select');

  actual = generator.next(false).value;
  expected = put(sendAlert({
    type: 'danger',
    isDismissible: true,
    delay: 10000,
    message: 'Error: Not authorized to perform batch delete operation.',
  }));

  // t.same(actual.PUT.action.alert.message, expected.PUT.action.alert.message, 'it should call alert with same message');
  // t.same(actual.PUT.action.alert.type, expected.PUT.action.alert.type, 'it should call alert with same type');

  actual = generator.next().done;
  expected = true;
  t.deepEqual(actual, expected, 'it should be done');

  t.end();
});

test('Ncr:saga:batchOperationFlow[Authorized]', (t) => {
  const generator = batchOperationFlow(action);
  generator.next();

  let actual = generator.next(true).value;
  let expected = fork(batchOperationGenerator, action.nodeRefs, action.config, action.type);
  t.same(actual, expected, 'it should fork the generator with expected parameters');

  const mockTask = createMockTask();
  actual = generator.next(mockTask).value;
  expected = take(actionTypes.BATCH_OPERATION_PAUSED);
  t.deepEqual(actual, expected, 'it should wait for the PAUSED action.');

  actual = generator.next().value;
  expected = cancel(mockTask);
  t.deepEqual(actual, expected, 'it should perform cancel.');

  actual = generator.next().value;
  expected = race({
    resumed: take(actionTypes.BATCH_OPERATION_RESUMED),
    destroyed: take(actionTypes.BATCH_OPERATION_DESTROYED),
    ended: take(actionTypes.BATCH_OPERATION_ENDED),
  });
  t.deepEqual(actual, expected, 'it should do a race for selected actions.');

  const mockResumed = { resumed: true };
  actual = generator.next(mockResumed).value;
  expected = fork(batchOperationGenerator, action.nodeRefs, action.config, action.type);
  t.deepEqual(actual, expected, 'it should fork the saga flow after resume.');

  actual = generator.next(mockTask).value;
  expected = take(actionTypes.BATCH_OPERATION_PAUSED);
  t.deepEqual(actual, expected, 'it should wait for the PAUSED action.');

  actual = generator.next().value;
  expected = cancel(mockTask);
  t.deepEqual(actual, expected, 'it should perform cancel.');

  // test that we're looping again
  const next = generator.next();
  t.deepEqual(next.done, false, 'it should not be done yet.');

  actual = next.value;
  expected = race({
    resumed: take(actionTypes.BATCH_OPERATION_RESUMED),
    destroyed: take(actionTypes.BATCH_OPERATION_DESTROYED),
    ended: take(actionTypes.BATCH_OPERATION_ENDED),
  });
  t.deepEqual(actual, expected, 'it should do a race for selected actions.');

  // test that finally done
  const mockDone = { done: true };
  actual = generator.next(mockDone).done;
  expected = true;
  t.deepEqual(actual, expected, 'it should be done.');

  t.end();
});

test('Ncr:saga:batchOperationFlow[batchOperationGenerator]', (t) => {
  const generator = batchOperationGenerator(nodeRefs, action.config, action.type);
  let actual = generator.next().value;
  let expected = select(getBatchOperationState);
  t.deepEqual(actual, expected, 'it should select for cancelled nodes on the store');

  const operation = 'DELETE';

  actual = generator.next().value;
  expected = put(startBatchOperation(operation));
  t.deepEqual(actual, expected, 'it should dispatch to start the batch operation');

  actual = generator.next().value;
  expected = select(getBatchOperationState);
  t.deepEqual(actual, expected, 'it should select for nodes on the store');

  actual = generator.next().value;
  expected = select(getNode, nodeRefs[0]);
  t.deepEqual(actual, expected, 'it should get the node from the store');

  generator.next(page1);

  actual = generator.next().value;
  const { pbj } = deleteNode(action.config.nodeSchema.createMessage({
    node_ref: nodeRefs[0],
  }));
  expected = put(pbj);
  t.deepEqual(actual, expected, 'it should call the pbj action and resolve it');

  actual = generator.next().value;
  expected = call(doRavenValidation, nodeRefs, action.config);
  t.same(actual, expected, 'it should call raven validation');

  actual = generator.next().value;
  expected = cancelled();
  t.deepEqual(actual, expected, 'it should jump to finally part of the code');

  t.end();
});

test('Ncr:saga:batchOperationFlow[doRavenValidation][Not Set - BatchOperation]', (t) => {
  const generator = doRavenValidation(nodeRefs, action.config);
  generator.next();
  const fakeBatchOperator = null;
  const actual = generator.next(fakeBatchOperator).value;
  const expected = undefined;

  t.deepEqual(actual, expected, 'it should return undefined if no batch operation');

  t.end();
});

test('Ncr:saga:batchOperationFlow[doRavenValidation][Set - BatchOperation]', (t) => {
  const generator = doRavenValidation(nodeRefs, action.config);
  const fakeBatchOperator = {
    status: batchOperationStatuses.PENDING,
    messages: [],
    operation: 'Publish',
  };
  generator.next();
  const actual = generator.next(fakeBatchOperator).value;
  const expected = call(waitForValidationResult, nodeRefs[0], action.config);
  t.deepEqual(actual, expected, 'it should call the waitForValidationResult function');

  t.end();
});
