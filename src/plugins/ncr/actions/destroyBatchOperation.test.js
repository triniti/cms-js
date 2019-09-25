import test from 'tape';
import { actionTypes } from '../constants';
import destroyBatchOperation from './destroyBatchOperation';

test('destroyBatchOperation action creator tests', (t) => {
  const actual = destroyBatchOperation();

  const expected = {
    type: actionTypes.BATCH_OPERATION_DESTROYED,
  };

  t.same(actual, expected, 'it should create a BATCH_OPERATION_DESTROYED action.');
  t.end();
});
