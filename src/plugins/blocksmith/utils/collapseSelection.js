import { EditorState, SelectionState } from 'draft-js';

/**
 * Collapses the selection.
 *
 * @param {EditorState} editorState   - a state instance of a DraftJs Editor
 *
 * @returns {EditorState} an EditorState instance
 */
export default (editorState) => {
  const selectionState = editorState.getSelection();
  const anchorKey = selectionState.getAnchorKey();

  const updateSelection = new SelectionState({
    anchorKey,
    anchorOffset: 0,
    focusKey: anchorKey,
    focusOffset: 0,
    isBackward: false,
  });

  const newEditorState = EditorState.acceptSelection(editorState, updateSelection);
  return EditorState.forceSelection(newEditorState, newEditorState.getSelection());
};
