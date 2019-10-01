import { actionTypes } from '../constants';

export default (policy) => ({
  type: actionTypes.POLICY_UPDATED,
  policy,
});
