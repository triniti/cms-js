import { ACCESS_TOKEN_STORAGE_KEY } from '@gdbots/pbjx/constants.js';
import { actionTypes } from '@triniti/cms/plugins/iam/constants.js';

export default (accessToken) => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
  return { type: actionTypes.LOGIN_ACCEPTED, accessToken };
};
