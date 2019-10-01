import { actionTypes } from '../constants';

/**
 * @param {string} accessToken
 * @returns {{type: *, accessToken: *}}
 */
export default (accessToken) => ({
  type: actionTypes.SESSION_RENEWAL_ACCEPTED,
  accessToken,
});
