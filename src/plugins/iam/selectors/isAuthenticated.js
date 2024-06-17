import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken.js';
import isJwtExpired from '@triniti/cms/plugins/iam/utils/isJwtExpired.js';

export default (state, strict = false) => {
  if (!state.iam.isAuthenticated) {
    return false;
  }

  return strict ? !isJwtExpired(getAccessToken(state)) : true;
};
