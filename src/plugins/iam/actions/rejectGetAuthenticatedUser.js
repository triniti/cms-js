import { actionTypes } from '../constants';

/**
 * @param exception
 * @returns {{exception: *, type: *}}
 */
export default (exception) => ({
  type: actionTypes.GET_AUTHENTICATED_USER_REJECTED,
  exception,
});
