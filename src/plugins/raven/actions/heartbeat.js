import { methods, serviceIds } from '@triniti/cms/plugins/raven/constants.js';
import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken.js';

export default (nodeRef) => async (dispatch, getState, app) => {
  if (!app.has(serviceIds.RAVEN_WORKER)) {
    return;
  }

  /*
  const state = getState();
  const accessToken = getAccessToken(state);
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

  if (data.ok) {
    // do we really need a swal here if node is different?
  }
  console.log('raven.heartbeat.data', data);
   */

  const raven = await app.get(serviceIds.RAVEN_WORKER);
  raven.postMessage({ method: methods.HEARTBEAT, nodeRef, ts: Math.floor(Date.now() / 1000) });
};
