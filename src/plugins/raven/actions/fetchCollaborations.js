/* globals API_ENDPOINT */
import ObjectSerializer from '@gdbots/pbj/serializers/ObjectSerializer';
import receiveNodes from 'plugins/ncr/actions/receiveNodes';
import simplifyCollaborations from 'plugins/raven/utils/simplifyCollaborations';
import updateCollaborations from 'plugins/raven/actions/updateCollaborations';


const deserializeNodes = async (derefs) => {
  const nodes = [];
  for (let i = 0; i < derefs.length; i++) {
    const node = await ObjectSerializer.deserialize(derefs[i]);
    nodes.push(node.freeze());
  }
  return nodes;
}


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
      dispatch(updateCollaborations(simplifyCollaborations(collaborations)));
      dispatch(receiveNodes(await deserializeNodes(Object.values(data.derefs))));
    }
  } catch (error) {
    console.error('raven::fetchCollaborations failed', error);
    if (window.onerror instanceof Function) {
      window.onerror(error);
    }
  }
};
