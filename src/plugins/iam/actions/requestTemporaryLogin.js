import { actionTypes } from '../constants';

export default (accessToken, resolve, reject) => ({
  type: actionTypes.TEMP_LOGIN_REQUESTED,
  accessToken,
  resolve,
  reject,
});
