import createReducer from '@triniti/app/createReducer';
import { actionTypes } from '../constants';

export const initialState = {};

const {
  SEARCH_NODES_VIEW_CHANGED,
} = actionTypes;

const onViewChanged = (prevState = {}, action) => {
  const { curie, view } = action;
  const state = { ...prevState };

  if (!prevState[`${curie}`]) {
    state[`${curie}`] = {
      view,
    };
    return state;
  }

  state[`${curie}`] = {
    ...state[`${curie}`],
    view,
  };
  return state;
};

export default createReducer(initialState, {
  [SEARCH_NODES_VIEW_CHANGED]: onViewChanged,
});
