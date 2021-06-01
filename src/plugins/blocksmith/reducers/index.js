import createReducer from '@triniti/app/createReducer';
import { actionTypes } from '../constants';

export const initialState = {};

const {
  EDITOR_CLEANED,
  EDITOR_DESTROYED,
  EDITOR_DIRTIED,
  EDITOR_STORED,
} = actionTypes;

const onEditorCleaned = (prevState = {}, action) => {
  const { formName } = action;
  const state = { ...prevState };
  state[formName] = { ...state[formName] };
  state[formName].isDirty = false;
  return state;
};

const onEditorDestroyed = (prevState = {}, action) => {
  const { formName } = action;
  const state = { ...prevState };
  delete state[formName];
  return state;
};

const onEditorDirtied = (prevState = {}, action) => {
  const { formName } = action;
  const state = { ...prevState };
  state[formName] = { ...state[formName] };
  state[formName].isDirty = true;
  return state;
};

const onEditorStored = (prevState = {}, action) => {
  const { formName, editorState } = action;
  const state = { ...prevState };
  state[formName] = { ...state[formName] };
  state[formName].editorState = editorState;
  return state;
};

export default createReducer(initialState, {
  [EDITOR_CLEANED]: onEditorCleaned,
  [EDITOR_DESTROYED]: onEditorDestroyed,
  [EDITOR_DIRTIED]: onEditorDirtied,
  [EDITOR_STORED]: onEditorStored,
});
