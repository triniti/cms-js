/* globals API_ENDPOINT */
import ObjectSerializer from '@gdbots/pbj/serializers/ObjectSerializer';
import nodesRecieved from '@triniti/cms/plugins/ncr/actions/nodesRecieved';
import { actionTypes } from '../constants';

import receiveCollaborationNodes from './receiveCollaborationNodes';

export default (accessToken) => async (dispatch) => {
  dispatch({
    type: actionTypes.COLLABORATION_NODES_REQUESTED,
  });

  try {
    const response = await fetch(`${API_ENDPOINT}/raven/collaborations/?with_nodes=true`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    });
    const data = await response.json();
    if (data.derefs) {
      dispatch(receiveCollaborationNodes(data));
      dispatch(nodesRecieved(Object.values(data.derefs).map((node) => ObjectSerializer.deserialize(node).freeze())));
    }
  } catch (error) {
    console.error('raven::requestCollaborationNodes failed', error);
  }
};
