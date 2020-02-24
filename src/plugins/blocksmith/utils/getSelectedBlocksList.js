/**
 * Returns collection of currently selected blocks.
 *
 * @link https://github.com/jpuri/draftjs-utils/blob/master/js/block.js
 *
 * @param {EditorState}   editorState - a state instance of a DraftJs Editor
 *
 * @returns {Map}
 */
const getSelectedBlocksMap = (editorState) => {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const startKey = selectionState.getStartKey();
  const endKey = selectionState.getEndKey();
  const blockMap = contentState.getBlockMap();
  return blockMap
    .toSeq()
    .skipUntil((_, k) => k === startKey)
    .takeUntil((_, k) => k === endKey)
    .concat([[endKey, blockMap.get(endKey)]]);
};

/**
 * Function returns collection of currently selected blocks.
 *
 * @param {EditorState}   editorState - a state instance of a DraftJs Editor
 *
 * @returns {List}
 *
 */
export default (editorState) => getSelectedBlocksMap(editorState).toList();
