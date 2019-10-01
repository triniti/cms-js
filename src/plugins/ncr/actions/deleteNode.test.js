import test from 'tape';
import { actionTypes } from '../constants';
import deleteNode from './deleteNode';

test('Ncr:actions:deleteNode', (t) => {
  const command = 'a pbj message';
  const history = {};
  const config = {
    configA: 'configA',
    configB: 'configB',
  };

  const actual = deleteNode(command, history, config);
  const expected = {
    type: actionTypes.DELETE_NODE_REQUESTED,
    pbj: command,
    history,
    config,
  };

  t.same(actual, expected, 'it should create a DELETE_NODE_REQUESTED action with a command and config');
  t.end();
});
