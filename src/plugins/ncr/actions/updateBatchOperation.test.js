import test from 'tape';
import { actionTypes } from '../constants';
import updateBatchOperation from './updateBatchOperation';

test('updateBatchOperation action creator tests', (t) => {
  const operation = 'TEST';
  const progress = 50;
  const messages = [];
  const actual = updateBatchOperation(operation, progress, messages);

  const expected = {
    type: actionTypes.BATCH_OPERATION_UPDATED,
    operation,
    progress,
    messages,
  };

  t.same(actual, expected, 'it should create a BATCH_OPERATION_UPDATED action.');
  t.end();
});
