import test from 'tape';
import deepFreeze from 'deep-freeze';
import isAuthenticated from './isAuthenticated';

const initState = {
  iam: {
    auth: {
      isAuthenticated: false,
      user: null,
    },
  },
};

const testState1 = {
  iam: {
    auth: {
      isAuthenticated: true,
      user: { title: 'the logged in user node' },
    },
  },
};

const testState2 = {
  iam: {
    auth: {
      isAuthenticated: true,
      user: null,
    },
  },
};

const testState3 = {
  iam: {
    auth: {
      isAuthenticated: false,
      user: { title: 'some title' },
    },
  },
};

deepFreeze(initState);
deepFreeze(testState1);
deepFreeze(testState2);

test('isAuthenticated selector tests', (t) => {
  t.false(isAuthenticated(initState));
  t.true(isAuthenticated(testState1));
  t.false(isAuthenticated(testState2));
  t.false(isAuthenticated(testState3));

  t.end();
});
