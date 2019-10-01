import { actionTypes } from '../constants';

export default (accessToken) => ({
  type: actionTypes.LOGIN_ACCEPTED,
  accessToken,
});
