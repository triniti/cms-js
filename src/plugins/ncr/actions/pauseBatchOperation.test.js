import test from 'tape';
import { actionTypes } from '../constants';
import pauseBatchOperation from './pauseBatchOperation';

test('pauseBatchOperation action creator tests', (t) => {
  const actual = pauseBatchOperation();

  const expected = {
    type: actionTypes.BATCH_OPERATION_PAUSED,
  };

  t.same(actual, expected, 'it should create a BATCH_OPERATION_PAUSED action.');
  t.end();
});
