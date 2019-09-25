import test from 'tape';
import AuthenticationException from '../exceptions/AuthenticationException';
import { actionTypes } from '../constants';
import rejectLogin from './rejectLogin';

test('rejectLogin tests', (t) => {
  const exception = new AuthenticationException('test', 'rejected');

  const actual = rejectLogin(exception);
  const expected = {
    type: actionTypes.LOGIN_REJECTED,
    exception,
  };

  t.same(actual, expected, 'it should create a LOGIN_REJECTED action with an exception.');

  t.end();
});
