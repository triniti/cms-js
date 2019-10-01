import test from 'tape';
import { actionTypes } from '../constants';
import endBatchOperation from './endBatchOperation';

test('endBatchOperation action creator tests', (t) => {
  const actual = endBatchOperation();

  const expected = {
    type: actionTypes.BATCH_OPERATION_ENDED,
  };

  t.same(actual, expected, 'it should create a BATCH_OPERATION_ENDED action.');
  t.end();
});
