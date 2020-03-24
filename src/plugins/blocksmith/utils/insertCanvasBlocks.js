import { ContentState, EditorState } from 'draft-js';
import constants from '../components/blocksmith/constants';
import convertToEditorState from './convertToEditorState';
import convertToCanvasBlocks from './convertToCanvasBlocks';
import selectBlock, { selectionTypes } from './selectBlock';

/**
 * Inserts a list of canvas blocks into the draft editor (as draft blocks with data, entity, etc)
 * and places the text indicator at the end of the final pasted block.
 *
 * @param {EditorState} editorState  - a state instance of a DraftJs Editor
 * @param {string}      key          - a DraftJs block key
 * @param {string}      position     - POSITION_BEFORE or POSITION_AFTER
 * @param {Array}       canvasBlocks - the blocks to be inserted into the editor
 *
 * @returns {EditorState} a EditorState instance
 */
export default (editorState, key, position, canvasBlocks) => {
  if (position !== constants.POSITION_BEFORE && position !== constants.POSITION_AFTER) {
    throw new Error('You must provide a valid insertion position.');
  }
  if (!canvasBlocks.length) {
    return editorState;
  }
  let newEditorState = editorState;
  const newContentState = newEditorState.getCurrentContent();
  let haveEncounteredKey = false;
  const { blocksBefore, blocksAfter } = newContentState.getBlocksAsArray().reduce((acc, cur) => {
    if (haveEncounteredKey) {
      acc.blocksAfter.push(cur);
      return acc;
    }
    if (cur.getKey() !== key) {
      acc.blocksBefore.push(cur);
      return acc;
    }
    if (!haveEncounteredKey) {
      haveEncounteredKey = true;
      return acc;
    }
    if (position === constants.POSITION_BEFORE) {
      acc.blocksAfter.push(cur);
    } else {
      acc.blocksBefore.push(cur);
    }
    return acc;
  }, { blocksBefore: [], blocksAfter: [] });
  const newCanvasBlocks = [];
  if (blocksBefore.length) {
    const editorStateBefore = EditorState.createWithContent(ContentState.createFromBlockArray(
      blocksBefore,
      newContentState.getEntityMap(),
    ));
    newCanvasBlocks.push(...convertToCanvasBlocks(editorStateBefore, true));
  }
  newCanvasBlocks.push(...canvasBlocks);
  if (blocksAfter.length) {
    const editorStateAfter = EditorState.createWithContent(ContentState.createFromBlockArray(
      blocksAfter,
      newContentState.getEntityMap(),
    ));
    newCanvasBlocks.push(...convertToCanvasBlocks(editorStateAfter, true));
  }
  newEditorState = convertToEditorState(newCanvasBlocks);
  newEditorState = EditorState.push(
    editorState,
    newEditorState.getCurrentContent(),
  );
  const newBlocks = newEditorState.getCurrentContent().getBlocksAsArray();
  let newBlock;
  let blockIndexToSelect = 0;
  for (let i = newBlocks.length - 1; i >= 0; i -= 1) {
    newBlock = newBlocks[i];
    if (newBlock.getData().get('canvasBlock') === canvasBlocks[canvasBlocks.length - 1]) {
      blockIndexToSelect = i;
      break;
    }
  }
  newEditorState = selectBlock(
    newEditorState,
    blockIndexToSelect,
    selectionTypes.END,
  );
  return newEditorState;
};
