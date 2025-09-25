import EnvelopeV1 from '@gdbots/schemas/gdbots/pbjx/EnvelopeV1.js';
import receiveEnvelope from '@triniti/cms/plugins/pbjx/actions/receiveEnvelope.js';
import isAuthenticated from '@triniti/cms/plugins/iam/selectors/isAuthenticated.js';
import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken.js';
import getUserRef from '@triniti/cms/plugins/iam/selectors/getUserRef.js';
import { actionTypes } from '@triniti/cms/plugins/raven/constants.js';

const LOG_PREFIX = 'raven.fetchInitialCollaborations/';

export default () => async (dispatch, getState, app) => {
  const state = getState();
  if (!isAuthenticated(state, true)) {
    return;
  }

  const accessToken = getAccessToken(state);
  const userRef = getUserRef(state);

  console.info(`${LOG_PREFIX}start`);

  try {
    const response = await fetch(`${API_ENDPOINT}/raven/collaborations/?with_nodes=true`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    });
    const data = await response.json();
    const collaborations = data.collaborations || {};

    console.info(`${LOG_PREFIX}received`, Object.keys(collaborations).length, 'active collaborations');

    // Update collaborations state with initial data
    dispatch({ type: actionTypes.COLLABORATIONS_UPDATED, collaborations });

    // If nodes are included, dispatch them to the store
    if (data.derefs) {
      try {
        const envelope = await EnvelopeV1.fromObject(data);
        dispatch(receiveEnvelope(envelope));
        console.info(`${LOG_PREFIX}nodes_dispatched`);
      } catch (e) {
        console.error(`${LOG_PREFIX}receiveEnvelope/error`, e.message, data);
      }
    }

    // Process each collaboration to dispatch heartbeat events
    Object.entries(collaborations).forEach(([nodeRef, collaborators]) => {
      Object.entries(collaborators).forEach(([collaboratorRef, ts]) => {
        if (collaboratorRef !== userRef) {
          dispatch({ type: actionTypes.HEARTBEAT, userRef: collaboratorRef, nodeRef, ts });
        }
      });
    });

    console.info(`${LOG_PREFIX}completed`);
  } catch (error) {
    console.error(`${LOG_PREFIX}failed`, error);
  }
};
