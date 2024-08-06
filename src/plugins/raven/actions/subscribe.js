import isAuthenticated from '@triniti/cms/plugins/iam/selectors/isAuthenticated.js';
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
  raven.postMessage({ method: methods.SUBSCRIBE, nodeRef });
};
