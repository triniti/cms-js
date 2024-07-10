import getBlockForKey from '@triniti/cms/blocksmith/utils/getBlockForKey.js';

/**
 * Gets the entity key for the current selection.
 *
 * @param {EditorState} editorState - a state instance of a DraftJs Editor
 *
 * @returns {?string} the entity key, or null if there is no entity
 */
export default (editorState) => {
  const selectionState = editorState.getSelection();
  const anchorBlock = getBlockForKey(
    editorState.getCurrentContent(),
    selectionState.getAnchorKey(),
  );
  const offset = selectionState.anchorOffset;
  const index = selectionState.isBackward ? offset - 1 : offset;
  return anchorBlock.getEntityAt(index);
};
