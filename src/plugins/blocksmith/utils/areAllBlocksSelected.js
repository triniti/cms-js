export default (editorState) => {
  const contentState = editorState.getCurrentContent();
  const firstBlock = contentState.getFirstBlock();
  const lastBlock = contentState.getLastBlock();
  const selectionState = editorState.getSelection();
  const anchorKey = selectionState.getAnchorKey();
  const anchorOffset = selectionState.getAnchorOffset();
  const focusKey = selectionState.getFocusKey();
  const focusOffset = selectionState.getFocusOffset();
  let areAllBlocksSelected = false;
  if (selectionState.getIsBackward()) {
    areAllBlocksSelected = anchorKey === lastBlock.getKey()
      && focusKey === firstBlock.getKey()
      && focusOffset === 0
      && anchorOffset === lastBlock.getText().length;
  } else {
    areAllBlocksSelected = anchorKey === firstBlock.getKey()
      && focusKey === lastBlock.getKey()
      && anchorOffset === 0
      && focusOffset === lastBlock.getText().length;
  }
  return areAllBlocksSelected;
};
