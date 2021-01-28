/* globals API_ENDPOINT */
import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken';
import getAuthenticatedUserRef from '@triniti/cms/plugins/iam/selectors/getAuthenticatedUserRef';
import isJwtExpired from '@triniti/cms/plugins/iam/utils/isJwtExpired';
import { actionTypes, ravenTypes } from '../constants';
import publishMessage from './publishMessage';

export default (nodeRef) => async (dispatch, getState) => {
  const state = getState();
  const accessToken = getAccessToken(state);
  const userRef = getAuthenticatedUserRef(state);

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
