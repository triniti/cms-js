import test from 'tape';
import { actionTypes } from '../constants';
import unlockNode from './unlockNode';

test('unlockNode action creator tests', (t) => {
  const command = {};
  const config = {};
  const actual = unlockNode(command, config);

  const expected = {
    type: actionTypes.UNLOCK_NODE_REQUESTED,
    pbj: command,
    config,
  };

  t.same(actual, expected, 'it should create a UNLOCK_NODE_REQUESTED action.');
  t.end();
});
