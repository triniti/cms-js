import test from 'tape';
import noop from 'lodash/noop';
import { call, cancelled, put } from 'redux-saga/effects';

import fulfillGetAuthenticatedUser from '../actions/fulfillGetAuthenticatedUser';
import loginFlow from './loginFlow';
import Policy from '../Policy';
import rejectGetAuthenticatedUser from '../actions/rejectGetAuthenticatedUser';
import rejectLogin from '../actions/rejectLogin';

global.localStorage = {
  getItem: noop,
};
const policy = new Policy();
const user = {};
const token = {
  accessToken: 'some_token',
};
const authenticator = {
  getUser: noop,
  showLogin: noop,
  hideLogin: noop,
  checkUserIdle: noop,
};

test('IAM:sagas:loginFlow[success]', (t) => {
  const generator = loginFlow(authenticator);

  let actual = generator.next().value;
  let expected = call([authenticator, 'showLogin']);
  t.deepEqual(actual, expected, 'it should show login page');

  generator.next();

  actual = generator.next(token).value;
  expected = call([authenticator, 'getUser'], token.accessToken);
  t.deepEqual(actual, expected, 'it should get user');

  actual = generator.next(user).value;
  expected = put(fulfillGetAuthenticatedUser(user, policy, token.accessToken));
  t.deepEqual(actual, expected, 'it should fullfill authenticated user');

  actual = generator.next().value;
  expected = call([authenticator, 'hideLogin']);
  t.deepEqual(actual, expected, 'it should hide login page');

  actual = generator.next().value;
  expected = call([authenticator, 'checkUserIdle']);
  t.deepEqual(actual, expected, 'it should start checking if user is idle');

  generator.next(); // move to the finally block

  actual = generator.next(false).done;
  t.true(actual, expected, 'it should be done');

  t.end();
});

test('IAM:sagas:loginFlow[exception]', (t) => {
  const generator = loginFlow(authenticator);

  let actual = generator.next().value;
  let expected = call([authenticator, 'showLogin']);
  t.deepEqual(actual, expected, 'it should show login page');

  generator.next();

  actual = generator.next(token).value;
  expected = call([authenticator, 'getUser'], token.accessToken);
  t.deepEqual(actual, expected, 'it should get user');

  actual = generator.next(user).value;
  expected = put(fulfillGetAuthenticatedUser(user, policy, token.accessToken));
  t.deepEqual(actual, expected, 'it should fullfill authenticated user');

  // simulate throwing an exception
  const loginError = new Error('login error');
  actual = generator.throw(loginError).value;
  expected = put(rejectGetAuthenticatedUser(loginError));
  t.deepEqual(actual, expected, 'it should reject user');

  actual = generator.next(true).value;
  expected = put(rejectLogin(loginError));
  t.deepEqual(actual, expected, 'it should reject login');

  generator.next(); // move to the finally block

  actual = generator.next(false).done;
  t.true(actual, expected, 'it should be done');

  t.end();
});

test('IAM:sagas:loginFlow[cancelled]', (t) => {
  const generator = loginFlow(authenticator);

  let actual = generator.next().value;
  let expected = call([authenticator, 'showLogin']);
  t.deepEqual(actual, expected, 'it should show login page');

  generator.next();

  actual = generator.next(token).value;
  expected = call([authenticator, 'getUser'], token.accessToken);
  t.deepEqual(actual, expected, 'it should get user');

  actual = generator.next(user).value;
  expected = put(fulfillGetAuthenticatedUser(user, policy, token.accessToken));
  t.deepEqual(actual, expected, 'it should fullfill authenticated user');

  // simulate cancellation after authenticating user
  actual = generator.return().value;
  expected = cancelled();
  t.deepEqual(actual, expected, 'it should be cancelled');

  const cancelError = new Error('login cancelled');
  actual = generator.next(true).value;
  expected = put(rejectGetAuthenticatedUser(cancelError));
  t.deepEqual(actual, expected, 'it should reject user');

  actual = generator.next(true).value;
  expected = put(rejectLogin(cancelError));
  t.deepEqual(actual, expected, 'it should reject login');

  actual = generator.next().done;
  t.true(actual, expected, 'it should be done');

  t.end();
});
