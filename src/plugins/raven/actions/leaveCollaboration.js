/* globals API_ENDPOINT */
import getAccessToken from 'plugins/iam/selectors/getAccessToken';
import getUserRef from 'plugins/iam/selectors/getUserRef';
import isJwtExpired from 'plugins/iam/utils/isJwtExpired';
import { actionTypes, ravenTypes } from 'plugins/raven/constants';
import publishMessage from 'plugins/raven/actions/publishMessage';

export default (nodeRef) => async (dispatch, getState) => {
  const state = getState();
  const accessToken = getAccessToken(state);
  const userRef = getUserRef(state);

  if (!isJwtExpired(accessToken)) {
    try {
      const formData = new FormData();
      formData.append('node_ref', nodeRef);
      await fetch(`${API_ENDPOINT}/raven/leave-collaboration/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      console.error('leaveCollaboration failed', nodeRef, error);
      window.onerror(error);
    }
  }

  dispatch({ type: actionTypes.COLLABORATOR_LEFT, nodeRef: `${nodeRef}`, userRef: `${userRef}` });
  return dispatch(publishMessage({ rt: ravenTypes.COLLABORATOR_LEFT }, `${nodeRef}`));
};
