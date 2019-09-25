import test from 'tape';
import { actionTypes } from '../constants';
import unpublishNode from './unpublishNode';

test('unpublishNode action creator tests', (t) => {
  const command = {};
  const config = {};
  const actual = unpublishNode(command, config);

  const expected = {
    type: actionTypes.UNPUBLISH_NODE_REQUESTED,
    pbj: command,
    config,
  };

  t.same(actual, expected, 'it should create a UNPUBLISH_NODE_REQUESTED action.');
  t.end();
});
