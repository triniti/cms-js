import { ACCESS_TOKEN_STORAGE_KEY } from '@gdbots/pbjx/constants.js';
import { actionTypes } from '@triniti/cms/plugins/iam/constants.js';

export default () => {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  return { type: actionTypes.LOGIN_REJECTED };
};
