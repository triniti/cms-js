import getAccessToken from 'plugins/iam/selectors/getAccessToken';
import isJwtExpired from 'plugins/iam/utils/isJwtExpired';

export default (state) => {
  if (!state.iam.isAuthenticated) {
    return false;
  }

  return !isJwtExpired(getAccessToken(state));
};
