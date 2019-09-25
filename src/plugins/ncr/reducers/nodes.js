import createReducer from '@triniti/app/createReducer';
import { actionTypes as pbjxActionTypes } from '@triniti/cms/plugins/pbjx/constants';


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

export default createReducer(initialState, {
  [pbjxActionTypes.ENVELOPE_RECEIVED]: onPbjxEnvelopeReceived,
});
