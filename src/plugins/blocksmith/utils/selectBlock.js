import { EditorState, SelectionState } from 'draft-js';
import { blockTypes } from '../constants';
import findBlock from './findBlock';
import getBlockForKey from './getBlockForKey';
import getBlockNode from './getBlockNode';
import getListBlocks from './getListBlocks';
import isBlockAList from './isBlockAList';

export const selectionTypes = {
  ALL: 'ALL',
  END: 'END',
  START: 'START',
};

/**
 * Selects a block, placing the cursor at the beginning, the end, or selecting the entire block.
 *
 * @param {EditorState} editorState   - a state instance of a DraftJs Editor
 * @param {(object|number|string)} id - a block, a block index, or a block key
 * @param {?string} position          - what to select/where to put the cursor. defaults to 'ALL'
 *
 * @returns {EditorState} an EditorState instance
 */

export default (editorState, id, position = selectionTypes.ALL) => {
  if (!Object.values(selectionTypes).includes(position)) {
    throw new Error(`['${position}'] is not a valid position. Enter ${selectionTypes.START}, ${selectionTypes.END}, ${selectionTypes.ALL}, or omit to default to ${selectionTypes.ALL}`);
  }
  const contentState = editorState.getCurrentContent();
  const blockToSelect = findBlock(contentState, id);
  let anchorKey = blockToSelect.getKey();
  let focusKey = blockToSelect.getKey();
  let anchorOffset = position === selectionTypes.END ? blockToSelect.getText().length : 0;
  let focusOffset = position === selectionTypes.START ? 0 : blockToSelect.getText().length;

  if (isBlockAList(blockToSelect)) {
    const listBlocks = getListBlocks(contentState, blockToSelect);
    const firstListBlock = getBlockForKey(contentState, listBlocks[0].getKey());
    const lastListBlock = getBlockForKey(contentState, listBlocks[listBlocks.length - 1].getKey());
    switch (position) {
      case selectionTypes.ALL:
        anchorKey = firstListBlock.getKey();
        focusKey = lastListBlock.getKey();
        anchorOffset = 0;
        focusOffset = lastListBlock.getText().length;
        break;
      case selectionTypes.START:
        anchorKey = firstListBlock.getKey();
        focusKey = firstListBlock.getKey();
        anchorOffset = 0;
        focusOffset = 0;
        break;
      case selectionTypes.END:
        anchorKey = lastListBlock.getKey();
        focusKey = lastListBlock.getKey();
        anchorOffset = lastListBlock.getText().length;
        focusOffset = lastListBlock.getText().length;
        break;
      default:
        break;
    }
  } else if (blockToSelect.getType() === blockTypes.ATOMIC) {
    // set the native selection to the node so the caret is not in the text and
    // the selectionState matches the native selection
    // taken from https://github.com/draft-js-plugins/draft-js-plugins/blob/master/draft-js-focus-plugin/src/modifiers/setSelection.js
    const node = getBlockNode(contentState, blockToSelect);
    const selection = window.getSelection();
    const range = document.createRange();
    range.setStart(node, 0);
    range.setEnd(node, 0);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  const updateSelection = new SelectionState({
    anchorKey,
    anchorOffset,
    focusKey,
    focusOffset,
    isBackward: false,
  });

  const newEditorState = EditorState.acceptSelection(editorState, updateSelection);
  return EditorState.forceSelection(newEditorState, newEditorState.getSelection());
};
