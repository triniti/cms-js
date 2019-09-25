import test from 'tape';
import { actionTypes } from '../constants';
import requestLogin from './requestLogin';

test('requestLogin tests', (t) => {
  const actual = requestLogin();
  const expected = {
    type: actionTypes.LOGIN_REQUESTED,
  };

  t.deepEqual(actual, expected, 'it should create a LOGIN_REQUESTED action');
  t.end();
});
