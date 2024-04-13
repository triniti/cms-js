import { ACCESS_TOKEN_STORAGE_KEY } from '@gdbots/pbjx/constants';
import { actionTypes, serviceIds } from '@triniti/cms/plugins/iam/constants';

export default () => (dispatch) => {
  const auth0SessionKey = sessionStorage.getItem(serviceIds.AUTH0_SESSION_KEY) || '@@auth0spajs@@::not_set';
  const auth0Token = {
    body: {
      expires_in: 0,
    },
    expiresAt: Math.floor(Date.now() / 1000) - 1,
  }
  sessionStorage.setItem(auth0SessionKey, JSON.stringify(auth0Token));

  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  dispatch({ type: actionTypes.LOGOUT_COMPLETED });
};
