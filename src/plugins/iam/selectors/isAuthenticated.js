import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken.js';
import isJwtExpired from '@triniti/cms/plugins/iam/utils/isJwtExpired.js';

export default (state) => {
  if (!state.iam.isAuthenticated) {
    return false;
  }

  return !isJwtExpired(getAccessToken(state));
};
