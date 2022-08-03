import { ACCESS_TOKEN_STORAGE_KEY } from '@gdbots/pbjx/constants';
import { actionTypes } from 'plugins/iam/constants';

export default () => {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  return { type: actionTypes.LOGIN_REJECTED };
};
