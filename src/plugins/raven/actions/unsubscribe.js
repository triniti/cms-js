import { methods, serviceIds } from '@triniti/cms/plugins/raven/constants.js';

export default (nodeRef) => async (dispatch, getState, app) => {
  if (!app.has(serviceIds.RAVEN_WORKER)) {
    return;
  }

  const raven = await app.get(serviceIds.RAVEN_WORKER);
  const server = await app.get(serviceIds.RAVEN_SERVER);

  const action = { method: methods.UNSUBSCRIBE, nodeRef };
  raven.postMessage(action);
  await server.unsubscribe(action);
};
