/* globals API_ENDPOINT */
import swal from 'sweetalert2';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import hasNode from '@triniti/cms/plugins/ncr/selectors/hasNode';
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


      let username = 'Unknown User';
      if (data.updater_ref) {
        const userRef = NodeRef.fromMessageRef(
          getNode(state, data.updater_ref).generateMessageRef(),
        );

        if (hasNode(state, userRef)) {
          const user = getNode(state, userRef);
          username = user.get('title', user.get('first_name'));
        }
      }

      if (etag
        && data.ok
        && data.etag !== etag
        && !swal.isVisible()
        && (data.last_event_ref || '').indexOf('apple-news-article-synced') === -1
        && (data.last_event_ref || '').indexOf('article-slotting-removed') === -1
        && (data.last_event_ref || '').indexOf('node-labels-updated') === -1
        && (data.last_event_ref || '').indexOf('teaser-slotting-removed') === -1
        // fixme: remove once gallery count updates are moved to their own stream
        && (data.last_event_ref || '').indexOf('gallery-asset-reordered') === -1
      ) {
        const nodeRef = NodeRef.fromString(topic);
        await swal.fire({
          html: `This ${nodeRef.getLabel()} has been changed by ${username} or a system process.<br/>If you save, you may overwrite their changes.`,
          position: 'top-end',
          showCloseButton: true,
          showConfirmButton: false,
          titleText: 'STALE DATA',
          toast: true,
          type: 'warning',
        });
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
