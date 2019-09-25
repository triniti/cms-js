import test from 'tape';
import { actionTypes } from '../constants';
import markNodeAsPending from './markNodeAsPending';

test('markNodeAsPending action creator tests', (t) => {
  const command = {};
  const config = {};
  const actual = markNodeAsPending(command, config);

  const expected = {
    type: actionTypes.MARK_NODE_AS_PENDING_REQUESTED,
    pbj: command,
    config,
  };

  t.same(actual, expected, 'it should create a MARK_NODE_AS_PENDING_REQUESTED action.');
  t.end();
});
