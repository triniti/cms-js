import test from 'tape';
import deepFreeze from 'deep-freeze';
import { actionTypes } from '../constants';
import reducer, { initialState } from './auth';


test('auth reducer tests', (t) => {
  const { LOGOUT_COMPLETED } = actionTypes;

  deepFreeze(initialState);
  t.deepEqual(initialState, reducer(undefined, {}), 'it should return initial state when state is undefined');

  const prevSession = { isAuthenticated: true, me: { title: 'prev loggedin user' } };
  deepFreeze(prevSession);
  t.deepEqual(
    reducer(prevSession, { type: LOGOUT_COMPLETED }),
    initialState,
    'it should have initial session data after logout complete',
  );

  t.end();
});
