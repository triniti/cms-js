import test from 'tape';
import { actionTypes } from '../constants';
import createNode from './createNode';

test('Ncr:action:createNode', (t) => {
  const command = 'a create node message';
  const resolve = () => {};
  const reject = () => {};
  const history = {};
  const config = { propA: 'A', propB: 'B' };

  const actual = createNode(command, resolve, reject, history, config);
  const expected = {
    type: actionTypes.CREATE_NODE_REQUESTED,
    pbj: command,
    resolve,
    reject,
    history,
    config,
  };

  t.same(actual, expected, 'it should create a CREATE_NODE_REQUESTED action with a command, resolve, reject, and config');
  t.end();
});
