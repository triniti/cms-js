/* globals API_ENDPOINT */
import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken.js';
import getUserRef from '@triniti/cms/plugins/iam/selectors/getUserRef.js';
import isJwtExpired from '@triniti/cms/plugins/iam/utils/isJwtExpired.js';
import { actionTypes, ravenTypes } from '@triniti/cms/plugins/raven/constants.js';
import publishMessage from '@triniti/cms/plugins/raven/actions/publishMessage.js';

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