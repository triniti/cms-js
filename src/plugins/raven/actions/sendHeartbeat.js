/* globals API_ENDPOINT */
import swal from 'sweetalert2';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken';
import isJwtExpired from '@triniti/cms/plugins/iam/utils/isJwtExpired';
import { actionTypes, ravenTypes } from '../constants';
import publishMessage from './publishMessage';
import isCollaborating from '../selectors/isCollaborating';

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
        && (data.last_event_ref || '').indexOf('teaser-slotting-removed') === -1
        // fixme: remove once gallery count updates are moved to their own stream
        && (data.last_event_ref || '').indexOf('gallery-asset-reordered') === -1
      ) {
        const nodeRef = NodeRef.fromString(topic);
        if (isCollaborating(state, nodeRef)) {
          await swal.fire({
            html: `This ${nodeRef.getLabel()} has been changed by another person or process.<br/>If you save, you may overwrite their changes.`,
            position: 'top-end',
            showCloseButton: true,
            showConfirmButton: false,
            titleText: 'STALE DATA',
            toast: true,
            type: 'warning',
          });
        } else {
          const result = await swal.fire({
            allowEnterKey: false,
            allowEscapeKey: false,
            allowOutsideClick: false,
            cancelButtonText: 'Ignore',
            confirmButtonText: 'Refresh',
            html: `This ${nodeRef.getLabel()} has been changed by another person or process. You need to refresh the page to see accurate data.`,
            reverseButtons: true,
            showCancelButton: true,
            title: 'STALE DATA',
            type: 'warning',
          });

          if (result.value) {
            window.location.reload(); // eslint-disable-line
          }
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
