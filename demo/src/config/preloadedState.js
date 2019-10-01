import { ACCESS_TOKEN_STORAGE_KEY } from '@gdbots/pbjx/constants';
import isJwtExpired from '../../../src/plugins/iam/utils/isJwtExpired';
import authUser from '../../../src/plugins/iam/utils/authUser';
import authRoles from '../../../src/plugins/iam/utils/authRoles';
import Policy from '../../../src/plugins/iam/Policy';

let accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
const isAuthenticated = !isJwtExpired(accessToken);
const user = isAuthenticated ? authUser.get() : null;
const policy = new Policy(authRoles.get());
accessToken = isAuthenticated ? accessToken : null;

export default {
  iam: {
    auth: {
      isAuthenticated,
      user,
      accessToken,
      policy,
    },
  },
};
