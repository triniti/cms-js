import createReducer from 'utils/createReducer';
import { actionTypes as pbjxActionTypes } from 'plugins/pbjx/constants';
import { actionTypes } from 'plugins/ncr/constants';

export const initialState = {};

const addNodes = (state, nodes) => {
  for (const node of nodes) {
    const schema = node.schema();
    if (!schema.hasMixin('gdbots:ncr:mixin:node')) {
      continue;
    }

    const qname = schema.getQName();
    const nodeRef = `${qname}:${node.get('_id')}`;
    state[nodeRef] = node.freeze();
    if (node.has('slug')) {
      state[`${qname}:${node.get('slug')}`] = nodeRef;
    }

    if (node.has('email')) {
      state[`${qname}:${node.get('email')}`] = nodeRef;
    }
  }
};

const onPbjxEnvelopeReceived = (prevState, action) => {
  const state = { ...prevState };
  const { pbj: envelope } = action;

  if (envelope.has('derefs')) {
    addNodes(state, Object.values(envelope.get('derefs')));
  }

  if (!envelope.has('message')) {
    return state;
  }

  const message = envelope.get('message');
  const nodes = [message];

  if (message.has('nodes')) {
    nodes.push(...message.get('nodes'));
  }

  if (message.has('node')) {
    nodes.push(message.get('node'));
  }

  addNodes(state, nodes);

  return state;
};

const onPruneNodes = (prevState) => {
  const state = { ...prevState };
  for (const nodeRef of Object.keys(state)) {
    if (nodeRef.endsWith('user') || nodeRef.endsWith('role') || nodeRef.endsWith('picklist')) {
      continue;
    }

    delete state[nodeRef];
  }

  return state;
};

const onReceivedNodes = (prevState, { nodes }) => {
  const state = { ...prevState };
  addNodes(state, nodes);
  return state;
}

export default createReducer(initialState, {
  [pbjxActionTypes.ENVELOPE_RECEIVED]: onPbjxEnvelopeReceived,
  [actionTypes.PRUNE_NODES]: onPruneNodes,
  [actionTypes.NODES_RECEIVED]: onReceivedNodes,
});
