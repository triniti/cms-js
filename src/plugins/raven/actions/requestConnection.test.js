import test from 'tape';
import requestConnection from './requestConnection';
import { actionTypes } from '../constants';

test('requestConnection tests', (t) => {
  const actual = requestConnection();
  const expected = { type: actionTypes.CONNECTION_REQUESTED };

  t.same(actual, expected, 'it should create a CONNECTION_REQUESTED action.');
  t.end();
});
