import test from 'tape';
import closeConnection from './closeConnection';
import { actionTypes } from '../constants';

test('closeConnection tests', (t) => {
  const actual = closeConnection();
  const expected = { type: actionTypes.CONNECTION_CLOSED };

  t.same(actual, expected, 'it should create a CONNECTION_CLOSED action.');
  t.end();
});
