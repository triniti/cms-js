import { actionTypes } from '../constants';

export default (formName, editorState, isDirty) => ({
  type: actionTypes.EDITOR_STORED,
  formName,
  editorState,
  isDirty,
});
