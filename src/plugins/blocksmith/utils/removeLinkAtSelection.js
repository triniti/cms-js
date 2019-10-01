import {
  EditorState,
  RichUtils,
} from 'draft-js';

/**
 * Removes a link from the selected text
 *
 * @param {EditorState} editorState - a state instance of a DraftJs Editor
 *
 * @returns {EditorState} an EditorState instance
 */

export default (editorState) => {
  const selection = editorState.getSelection();
  let newEditorState = RichUtils.toggleLink(editorState, selection, null);

  newEditorState = EditorState.acceptSelection(newEditorState, newEditorState.getSelection());
  return EditorState.forceSelection(newEditorState, newEditorState.getSelection());
};
