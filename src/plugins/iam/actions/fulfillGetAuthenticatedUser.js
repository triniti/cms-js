import { actionTypes } from '../constants';

/**
 * @param {object} user
 * @param {object} policy
 * @param {string} accessToken
 * @returns {{type: *, accessToken: *, user: *, policy: *}}
 */
export default (user, policy, accessToken) => ({
  type: actionTypes.GET_AUTHENTICATED_USER_FULFILLED,
  user,
  policy,
  accessToken,
});
