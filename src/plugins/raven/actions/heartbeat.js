import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import isAuthenticated from '@triniti/cms/plugins/iam/selectors/isAuthenticated.js';
import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken.js';
import getUserRef from '@triniti/cms/plugins/iam/selectors/getUserRef.js';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode.js';
import shouldShowStaleDataWarning from '@triniti/cms/plugins/raven/utils/shouldShowStaleDataWarning.js';
import showStaleDataWarning from '@triniti/cms/plugins/raven/utils/showStaleDataWarning.js';
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
  const accessToken = getAccessToken(state);
  const userRef = getUserRef(state);
  raven.postMessage({ method: methods.SET_TOKEN, userRef, accessToken });

  const formData = new FormData();
  let data;

  try {
    formData.append('node_ref', nodeRef);
    const response = await fetch(`${API_ENDPOINT}/raven/heartbeat/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
      method: 'POST',
      body: formData,
    });
    data = await response.json();
  } catch (e) {
    console.error('raven.heartbeat.failed', nodeRef, e.message);
    data = { ok: false };
  }

  const node = getNode(state, nodeRef);
  if (data.ok && shouldShowStaleDataWarning(data.last_event_ref, data.etag, node)) {
    const ref = NodeRef.fromString(`${nodeRef}`);
    const updaterRef = data.updater_ref ? NodeRef.fromString(data.updater_ref) : '';
    let username = 'SYSTEM';
    if (updaterRef) {
      const user = getNode(state, updaterRef);
      if (user) {
        username = user.get('title');
      }
    }

    await showStaleDataWarning(ref, username);

    // todo: make this a single operation if we still need it.
    /*
    Object.entries(data.collaborators || {}).forEach(([uref, ts]) => {
      if (uref === userRef) {
        return;
      }

      dispatch({ type: actionTypes.HEARTBEAT, userRef: uref, nodeRef, ts });
    });
     */
  }

  raven.postMessage({ method: methods.HEARTBEAT, nodeRef, ts: Math.floor(Date.now() / 1000) });
};
