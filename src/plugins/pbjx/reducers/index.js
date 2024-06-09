import createReducer from '@triniti/cms/utils/createReducer.js';
import { actionTypes } from '@triniti/cms/plugins/pbjx/constants.js';

export const initialState = {};

const onRequestCleared = (prevState = {}, action) => {
  const state = { ...prevState };
  const { channel, curie } = action;
  delete state[`${curie}${channel}`];
  return state;
};

const onRequestPersisted = (prevState = {}, action) => {
  const state = { ...prevState };
  const { channel, pbj } = action;
  const curie = pbj.schema().getCurie().toString();
  state[`${curie}${channel}`] = pbj.toObject();
  return state;
};

export default createReducer(initialState, {
  [actionTypes.REQUEST_CLEARED]: onRequestCleared,
  [actionTypes.REQUEST_PERSISTED]: onRequestPersisted,
});
