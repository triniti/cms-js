/* globals API_ENDPOINT */
import swal from 'sweetalert2';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken';
import isJwtExpired from '@triniti/cms/plugins/iam/utils/isJwtExpired';
import { actionTypes, ravenTypes } from '../constants';
import publishMessage from './publishMessage';

export default (topic, etag = null) => async (dispatch, getState) => {
  const state = getState();
  const accessToken = getAccessToken(state);

  if (!isJwtExpired(accessToken)) {
    try {
      const formData = new FormData();
      formData.append('node_ref', topic);
      const response = await fetch(`${API_ENDPOINT}/raven/heartbeat/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (etag
        && data.ok
        && data.etag !== etag
        && !swal.isVisible()
        && (data.last_event_ref || '').indexOf('apple-news-article-synced') === -1
        && (data.last_event_ref || '').indexOf('article-slotting-removed') === -1
        // fixme: remove once gallery count updates are moved to their own stream
        && (data.last_event_ref || '').indexOf('gallery-asset-reordered') === -1
      ) {
        const nodeRef = NodeRef.fromString(topic);
        const result = await swal.fire({
          type: 'warning',
          title: 'STALE DATA',
          html: `This ${nodeRef.getLabel()} has been changed <em>(${data.last_event_ref})</em>.`,
          allowEscapeKey: false,
          allowEnterKey: false,
          allowOutsideClick: false,
          showCancelButton: true,
          confirmButtonText: `Refresh ${nodeRef.getLabel()}`,
          cancelButtonText: 'Ignore - you will not be able to save',
          reverseButtons: true,
        });

        if (result.value) {
          window.location.reload(); // eslint-disable-line
        }
      }

      Object.entries(data.collaborators || {}).forEach(([ref, ts]) => {
        dispatch({
          type: actionTypes.HEARTBEAT,
          nodeRef: topic,
          userRef: ref,
          ts,
        });
      });
    } catch (error) {
      console.error('sendHeartbeat failed', topic, error);
    }
  }

  return dispatch(publishMessage({ rt: ravenTypes.HEARTBEAT }, topic));
};
