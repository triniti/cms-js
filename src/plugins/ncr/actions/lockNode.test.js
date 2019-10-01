import test from 'tape';
import { actionTypes } from '../constants';
import lockNode from './lockNode';

test('lockNode action creator tests', (t) => {
  const command = {};
  const config = {};
  const actual = lockNode(command, config);

  const expected = {
    type: actionTypes.LOCK_NODE_REQUESTED,
    pbj: command,
    config,
  };

  t.same(actual, expected, 'it should create a LOCK_NODE_REQUESTED action.');
  t.end();
});
