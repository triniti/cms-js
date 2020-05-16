import { actionTypes } from '../constants';

export default (formName, editorState, isDirty = false) => ({
  type: actionTypes.EDITOR_STORED,
  formName,
  editorState,
  isDirty,
});
