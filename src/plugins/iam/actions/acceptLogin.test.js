import test from 'tape';
import { actionTypes } from '../constants';
import acceptLogin from './acceptLogin';

test('acceptLogin tests', (t) => {
  const accessToken = 'random token strings';

  const actual = acceptLogin(accessToken);
  const expected = {
    type: actionTypes.LOGIN_ACCEPTED,
    accessToken,
  };

  t.same(actual, expected, 'it should create a LOGIN_ACCEPTED action with an access token');
  t.end();
});
