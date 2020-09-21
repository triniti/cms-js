import test from 'tape';
import { actionTypes } from '../constants';
import updateNode from './updateNode';

test('Ncr:action:updateNode', (t) => {
  const command = 'update node message';
  const history = {};
  const match = {};
  const config = { test: 'test', setting: 'setting', successMsg: 'node updated' };

  const actual = updateNode(command, history, match, config);
  const expected = {
    type: actionTypes.UPDATE_NODE_REQUESTED,
    pbj: command,
    history,
    match,
    config,
  };

  t.same(actual, expected, 'it should create a UPDATE_NODE_REQUESTED action with a command, history, match and config');
  t.end();
});
