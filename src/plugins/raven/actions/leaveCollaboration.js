import isAuthenticated from '@triniti/cms/plugins/iam/selectors/isAuthenticated.js';
import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken.js';
import getUserRef from '@triniti/cms/plugins/iam/selectors/getUserRef.js';
import { methods, serviceIds } from '@triniti/cms/plugins/raven/constants.js';

export default (nodeRef) => async (dispatch, getState, app) => {
  if (!app.has(serviceIds.RAVEN_WORKER)) {
    return;
  }

  const state = getState();
  if (!isAuthenticated(state, true)) {
    return;
  }

  const raven = await app.get(serviceIds.RAVEN_WORKER);
  const server = await app.get(serviceIds.RAVEN_SERVER);

  const accessToken = getAccessToken(state);
  const userRef = getUserRef(state);
  raven.postMessage({ method: methods.SET_TOKEN, userRef, accessToken });

  const action = { method: methods.LEAVE_COLLABORATION, nodeRef };
  raven.postMessage(action);
  await server.leaveCollaboration(action);
};
