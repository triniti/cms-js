/* globals API_ENDPOINT */
import EnvelopeV1 from '@gdbots/schemas/gdbots/pbjx/EnvelopeV1';
import receiveEnvelope from '@triniti/cms/plugins/pbjx/actions/receiveEnvelope';
import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken';
import isJwtExpired from '@triniti/cms/plugins/iam/utils/isJwtExpired';
import { actionTypes, ravenTypes } from '../constants';
import publishMessage from './publishMessage';

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

      dispatch(receiveEnvelope(EnvelopeV1.fromObject(data)));
      Object.entries(data.collaborators || {}).forEach(([ref, ts]) => {
        dispatch({
          type: actionTypes.COLLABORATOR_JOINED,
          nodeRef: `${nodeRef}`,
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


// fixme: restore the toast feature of collaborator joined
/*
if (!action.isMe
  && message.userName
  && (action.type === actionTypes.RT_USER_CONTINUED_IN_EDIT_MODE
    || action.type === actionTypes.RT_COLLABORATOR_JOINED)) {
  if (yield select(isCollaborating, action.topic)) {
    let collaborators = [];
    const toastContainer = document.getElementsByClassName('active-collaborator-notification')[0];
    if (toastContainer) {
      collaborators = [...toastContainer.querySelector('h5').innerText.split(',')];
    }

    if (!collaborators.includes(action.userName)) {
      collaborators.push(action.userName);
    }

    const toast = swal.mixin({
      toast: true,
      position: 'top-end',
      confirmButtonText: 'OK',
      confirmButtonClass: 'btn btn-sm btn-link-bg text-body',
    });

    toast({
      type: 'info',
      html: `<h5>${collaborators.join(', ')}</h5><p>joined collaboration</p>`,
      customClass: 'active-collaborator-notification',
    });
  }
}
 */
