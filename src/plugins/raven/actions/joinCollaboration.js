/* globals API_ENDPOINT */
import EnvelopeV1 from '@gdbots/schemas/gdbots/pbjx/EnvelopeV1';
import receiveEnvelope from 'plugins/pbjx/actions/receiveEnvelope';
import getAccessToken from 'plugins/iam/selectors/getAccessToken';
import isJwtExpired from 'plugins/iam/utils/isJwtExpired';
import { actionTypes, ravenTypes } from 'plugins/raven/constants';
import publishMessage from 'plugins/raven/actions/publishMessage';

export default (nodeRef) => async (dispatch, getState) => {
  const state = getState();
  const accessToken = getAccessToken(state);

  if (!isJwtExpired(accessToken)) {
    try {
      const formData = new FormData();
      formData.append('node_ref', nodeRef);
      const response = await fetch(`${API_ENDPOINT}/raven/join-collaboration/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      dispatch(receiveEnvelope(await EnvelopeV1.fromObject(data)));
      Object.entries(data.collaborators || {}).forEach(([ref, ts]) => {
        dispatch({
          type: actionTypes.COLLABORATOR_JOINED,
          nodeRef,
          userRef: ref,
          ts,
        });
      });
    } catch (error) {
      console.error('joinCollaboration failed', nodeRef, error);
      window.onerror(error);
    }
  }

  return dispatch(publishMessage({ rt: ravenTypes.COLLABORATOR_JOINED }, `${nodeRef}`));
};