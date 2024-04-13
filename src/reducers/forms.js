import createReducer from '@triniti/cms/utils/createReducer';
import { actionTypes } from '@triniti/cms/constants';

export const initialState = {};

const onFormRegistered = (prevState = {}, action) => {
  const state = { ...prevState };
  state[action.form.name] = action.form;
  return state;
};

const onFormUnregistered = (prevState = {}, action) => {
  const state = { ...prevState };
  delete state[action.name];
  return state;
};

export default createReducer(initialState, {
  [actionTypes.FORM_REGISTERED]: onFormRegistered,
  [actionTypes.FORM_UNREGISTERED]: onFormUnregistered,
});
