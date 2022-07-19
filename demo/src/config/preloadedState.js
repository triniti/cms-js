import { ACCESS_TOKEN_STORAGE_KEY } from '@gdbots/pbjx/constants';
import isJwtExpired from '@triniti/cms/plugins/iam/utils/isJwtExpired';
import { THEME_STORAGE_KEY } from '@triniti/cms/constants';

export default () => {
  const preloadedState = CLIENT_PRELOADED_STATE || {};
  const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  const isAuthenticated = !isJwtExpired(accessToken);

  preloadedState.app = {
    theme: localStorage.getItem(THEME_STORAGE_KEY),
  };

  preloadedState.iam = {
    accessToken: isAuthenticated ? accessToken : null,
    isAuthenticated,
  };

  return preloadedState;
};
