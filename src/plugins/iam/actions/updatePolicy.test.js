import test from 'tape';
import { actionTypes } from '../constants';
import updatePolicy from './updatePolicy';

test('updatePolicy tests', (t) => {
  const policy = null;
  const actual = updatePolicy(policy);
  const expected = {
    type: actionTypes.POLICY_UPDATED,
    policy,
  };

  t.deepEqual(actual, expected, 'it should create a POLICY_UPDATED action');
  t.end();
});
