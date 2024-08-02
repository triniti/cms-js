import { methods, serviceIds } from '@triniti/cms/plugins/raven/constants.js';

export default () => async (dispatch, getState, app) => {
  if (!app.has(serviceIds.RAVEN_WORKER)) {
    return;
  }
  const raven = await app.get(serviceIds.RAVEN_WORKER);
  raven.postMessage({ method: methods.DISCONNECT });
};
