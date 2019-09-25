import test from 'tape';
import openConnection from './openConnection';
import { actionTypes } from '../constants';

test('openConnection tests', (t) => {
  const actual = openConnection();
  const expected = { type: actionTypes.CONNECTION_OPENED };

  t.same(actual, expected, 'it should create a CONNECTION_OPENED action.');
  t.end();
});
