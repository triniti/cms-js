import { ACCESS_TOKEN_STORAGE_KEY } from '@gdbots/pbjx/constants';
import { actionTypes } from 'plugins/iam/constants';

export default (accessToken) => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
  return { type: actionTypes.LOGIN_ACCEPTED, accessToken };
};
