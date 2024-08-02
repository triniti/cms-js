import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken.js';
import { methods, serviceIds } from '@triniti/cms/plugins/raven/constants.js';

export default (user) => async (dispatch, getState, app) => {
  if (!app.has(serviceIds.RAVEN_WORKER)) {
    return;
  }

  const state = getState();
  const accessToken = getAccessToken(state);
  const userRef = user.generateNodeRef().toString();

  const raven = await app.get(serviceIds.RAVEN_WORKER);
  raven.postMessage({ method: methods.CONNECT, accessToken, userRef });
};
