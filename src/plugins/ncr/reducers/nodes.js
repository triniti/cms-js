import createReducer from '@triniti/app/createReducer';
import { actionTypes as pbjxActionTypes } from '@triniti/cms/plugins/pbjx/constants';
import { actionTypes } from '../constants';


export const initialState = {};

const onPbjxEnvelopeReceived = (prevState, action) => {
  if (!action.pbj.has('derefs')) {
    return prevState;
  }

  const state = { ...prevState };
  Object.values(action.pbj.get('derefs')).forEach((message) => {
    const schema = message.schema();
    if (!schema.hasMixin('gdbots:ncr:mixin:node')) {
      return;
    }

    const label = schema.getQName().getMessage();
    if (!state[label]) {
      state[label] = {};
    }

    state[label][message.get('_id')] = message.freeze();
  });

  return state;
};

const onNodesRecieved = (prevState, action) => {
  const state = { ...prevState };
  action.nodes.forEach((node) => {
    const label = node.schema().getCurie().getMessage();
    state[label] = { ...state[label] };
    state[label][node.get('_id')] = node.freeze();
  });
  return state;
};

export default createReducer(initialState, {
  [pbjxActionTypes.ENVELOPE_RECEIVED]: onPbjxEnvelopeReceived,
  [actionTypes.NODES_RECEIVED]: onNodesRecieved,
});
