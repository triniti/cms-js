import test from 'tape';
import { actionTypes } from '../constants';
import startBatchOperation from './startBatchOperation';

test('startBatchOperation action creator tests', (t) => {
  const operation = 'TEST';
  const actual = startBatchOperation(operation);

  const expected = {
    type: actionTypes.BATCH_OPERATION_STARTED,
    operation,
  };

  t.same(actual, expected, 'it should create a BATCH_OPERATION_STARTED action.');
  t.end();
});
