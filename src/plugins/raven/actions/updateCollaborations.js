/* globals API_ENDPOINT */
import ObjectSerializer from '@gdbots/pbj/serializers/ObjectSerializer';
import receiveNodes from '@triniti/cms/plugins/ncr/actions/receiveNodes'; // reciebe nodes
import { actionTypes } from '../constants';

export default (accessToken) => async (dispatch) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/raven/collaborations/?with_nodes=true`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    });
    const data = await response.json();
    const collaborations = data.collaborations;
    if (data.derefs) {
      dispatch({ type: actionTypes.COLLABORATIONS_UPDATED, collaborations });
      dispatch(receiveNodes(Object.values(data.derefs).map((node) => ObjectSerializer.deserialize(node).freeze())));
    }
  } catch (error) {
    console.error('raven::updateCollaborations failed', error);
  }
};
