import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken';
import isJwtExpired from '@triniti/cms/plugins/iam/utils/isJwtExpired';

export default (state) => {
  if (!state.iam.isAuthenticated) {
    return false;
  }

  return !isJwtExpired(getAccessToken(state));
};
