import EnvelopeV1 from '@gdbots/schemas/gdbots/pbjx/EnvelopeV1.js';
import receiveEnvelope from '@triniti/cms/plugins/pbjx/actions/receiveEnvelope.js';
import isAuthenticated from '@triniti/cms/plugins/iam/selectors/isAuthenticated.js';
import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken.js';
import getUserRef from '@triniti/cms/plugins/iam/selectors/getUserRef.js';
import { actionTypes, methods, serviceIds } from '@triniti/cms/plugins/raven/constants.js';

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

  const action = { method: methods.JOIN_COLLABORATION, nodeRef, ts: Math.floor(Date.now() / 1000) };
  raven.postMessage(action);
  const data = await server.joinCollaboration(action);

  if (data.ok) {
    try {
      const envelope = await EnvelopeV1.fromObject(data);
      dispatch(receiveEnvelope(envelope));
    } catch (e) {
      console.error('raven.joinCollaboration/receiveEnvelope/error', e.message, data);
    }

    Object.entries(data.collaborators || {}).forEach(([key, ts]) => {
      if (key === userRef) {
        return;
      }

      dispatch({ type: actionTypes.HEARTBEAT, userRef: key, nodeRef, ts });
    });
  }
};
