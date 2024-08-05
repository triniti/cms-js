import { methods, serviceIds } from '@triniti/cms/plugins/raven/constants.js';

export default (nodeRef) => async (dispatch, getState, app) => {
  if (!app.has(serviceIds.RAVEN_WORKER)) {
    return;
  }

  const raven = await app.get(serviceIds.RAVEN_WORKER);
  raven.postMessage({ method: methods.JOIN_COLLABORATION, nodeRef, ts: Math.floor(Date.now() / 1000) });
};
