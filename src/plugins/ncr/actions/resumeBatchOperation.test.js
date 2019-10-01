import test from 'tape';
import { actionTypes } from '../constants';
import resumeBatchOperation from './resumeBatchOperation';

test('resumeBatchOperation action creator tests', (t) => {
  const actual = resumeBatchOperation();

  const expected = {
    type: actionTypes.BATCH_OPERATION_RESUMED,
  };

  t.same(actual, expected, 'it should create a BATCH_OPERATION_RESUMED action.');
  t.end();
});
