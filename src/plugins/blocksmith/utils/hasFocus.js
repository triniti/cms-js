import blockParentNode from './blockParentNode';

/**
 * More reliable way to determine if the editor has focus, using draft's method and window.
 *
 * Not using this results in the following:
 * 1. click into editor block, block is styled as active
 * 2. click outside of the editor (blur) no block is active
 * 3. mouseover editor (no clicky!)
 * 4. mouseleave editor
 * 5. the block that was previously styled is styled again because draft thinks the editor
 *    has focus even though it doesn't
 *
 * @param {SelectionState} selectionState - a draftjs SelectionState
 *
 * @returns {boolean}
 */

export default (selectionState) => {
  const focusNode = window.getSelection().focusNode;
  if (!focusNode) {
    return false;
  }
  return selectionState.getHasFocus() && blockParentNode.contains(focusNode);
};
