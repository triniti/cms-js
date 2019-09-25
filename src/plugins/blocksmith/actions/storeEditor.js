import { actionTypes } from '../constants';

export default (formName, editorState) => ({
  type: actionTypes.EDITOR_STORED,
  formName,
  editorState,
});
