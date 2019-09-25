import test from 'tape';
import { actionTypes } from '../constants';
import publishNode from './publishNode';

test('publishNode action creator tests', (t) => {
  const command = {};
  const config = {};
  const actual = publishNode(command, config);

  const expected = {
    type: actionTypes.PUBLISH_NODE_REQUESTED,
    pbj: command,
    config,
  };

  t.same(actual, expected, 'it should create a PUBLISH_NODE_REQUESTED action.');
  t.end();
});
