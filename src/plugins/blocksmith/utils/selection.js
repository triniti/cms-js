let windowSelection = {};
let draftSelection = null;

export default {
  /**
   * Clear cached window and draft selection
   */
  clearCache: () => {
    windowSelection = {};
    draftSelection = null;
  },
  /**
   * Captures the selection state, to be later restored.
   *
   * @param {EditorState} editorState - a state instance of a DraftJs Editor
   */
  capture: (editorState) => {
    const selection = window.getSelection();
    draftSelection = editorState.getSelection();
    if (draftSelection.getIsBackward()) {
      windowSelection.anchorNode = selection.focusNode;
      windowSelection.focusNode = selection.anchorNode;
      windowSelection.anchorOffset = selection.focusOffset;
      windowSelection.focusOffset = selection.anchorOffset;
    } else {
      windowSelection.anchorNode = selection.anchorNode;
      windowSelection.focusNode = selection.focusNode;
      windowSelection.anchorOffset = selection.anchorOffset;
      windowSelection.focusOffset = selection.focusOffset;
    }
  },
  /**
   * Restores the window's selection state to that which was captured.
   */
  restore: () => {
    const selection = window.getSelection();
    const range = document.createRange();
    range.setStart(windowSelection.anchorNode, windowSelection.anchorOffset);
    range.setEnd(windowSelection.focusNode, windowSelection.focusOffset);
    selection.removeAllRanges();
    selection.addRange(range);
  },
};
