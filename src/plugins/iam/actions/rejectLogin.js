import { ACCESS_TOKEN_STORAGE_KEY } from '@gdbots/pbjx/constants';
import { actionTypes } from '@triniti/cms/plugins/iam/constants';

export default () => {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  return { type: actionTypes.LOGIN_REJECTED };
};
