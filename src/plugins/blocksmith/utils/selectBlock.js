import { EditorState, SelectionState } from 'draft-js';
import { blockTypes } from '../constants';
import findBlock from './findBlock';
import getBlockForKey from './getBlockForKey';
import getBlockNode from './getBlockNode';
import getListBlockNodes from './getListBlockNodes';
import isBlockAList from './isBlockAList';

/**
 * Selects a block, placing the cursor at the beginning, the end, or selecting the entire block.
 *
 * @param {EditorState} editorState   - a state instance of a DraftJs Editor
 * @param {(object|number|string)} id - a block, a block index, or a block key
 * @param {?string} position          - what to select/where to put the cursor. defaults to 'all'
 *
 * @returns {EditorState} an EditorState instance
 */

export default (editorState, id, position = 'all') => {
  if (position !== 'start' && position !== 'end' && position !== 'all') {
    throw new Error(`['${position}'] is not a valid position. Enter 'start', 'end', 'all', or omit to default to 'all'`);
  }
  const contentState = editorState.getCurrentContent();
  const blockToSelect = findBlock(contentState, id);
  let anchorKey = blockToSelect.getKey();
  let focusKey = blockToSelect.getKey();
  let anchorOffset = position === 'end' ? blockToSelect.getText().length : 0;
  let focusOffset = position === 'start' ? 0 : blockToSelect.getText().length;

  if (isBlockAList(blockToSelect)) {
    const listBlockNodes = getListBlockNodes(contentState, blockToSelect);
    const firstListBlock = getBlockForKey(contentState, listBlockNodes[0].getAttribute('data-offset-key'));
    const lastListBlock = getBlockForKey(contentState, listBlockNodes[listBlockNodes.length - 1].getAttribute('data-offset-key'));
    switch (position) {
      case 'all':
        anchorKey = firstListBlock.getKey();
        focusKey = lastListBlock.getKey();
        anchorOffset = 0;
        focusOffset = lastListBlock.getText().length;
        break;
      case 'start':
        anchorKey = firstListBlock.getKey();
        focusKey = firstListBlock.getKey();
        anchorOffset = 0;
        focusOffset = 0;
        break;
      case 'end':
        anchorKey = lastListBlock.getKey();
        focusKey = lastListBlock.getKey();
        anchorOffset = lastListBlock.getKey().length;
        focusOffset = lastListBlock.getKey().length;
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
