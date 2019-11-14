/* globals API_ENDPOINT */
import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken';
import isJwtExpired from '@triniti/cms/plugins/iam/utils/isJwtExpired';
import { actionTypes } from '../constants';

export default (nodeRef) => async (dispatch, getState) => {
  const state = getState();
  const accessToken = getAccessToken(state);

  let status = 'unknown';
  if (!isJwtExpired(accessToken)) {
    try {
      const formData = new FormData();
      formData.append('node_ref', nodeRef);
      const response = await fetch(`${API_ENDPOINT}/medialive/channel-status/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
        method: 'POST',
        body: formData,
      });
      const envelope = await response.json();
      status = envelope.medialive_channel_status;
    } catch (error) {
      console.error('getMedialiveChannelStatus failed', nodeRef, error);
    }
  }

  dispatch({ type: actionTypes.MEDIALIVE_CHANNEL_STATUS_RECEIVED, nodeRef: `${nodeRef}`, status });
};
