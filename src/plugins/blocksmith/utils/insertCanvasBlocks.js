import { ContentState, EditorState } from 'draft-js';
import constants from '../components/blocksmith/constants';
import convertToEditorState from './convertToEditorState';
import convertToCanvasBlocks from './convertToCanvasBlocks';
import selectBlock, { selectionTypes } from './selectBlock';

/**
 * Inserts a list of canvas blocks into the draft editor (as draft blocks with data, entity, etc).
 *
 * @param {EditorState} editorState  - a state instance of a DraftJs Editor
 * @param {string}      key          - a DraftJs block key
 * @param {string}      position     - POSITION_BEFORE or POSITION_AFTER
 * @param {Array}       canvasBlocks - the blocks to be inserted into the editor
 *
 * @returns {ContentState} a ContentState instance
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
    if (!haveEncounteredKey) {
      if (cur.getKey() !== key) {
        acc.blocksBefore.push(cur);
        return acc;
      }
      haveEncounteredKey = true;
      if (position === constants.POSITION_BEFORE) {
        acc.blocksAfter.push(cur);
      } else {
        acc.blocksBefore.push(cur);
      }
      return acc;
    }
    acc.blocksAfter.push(cur);
    return acc;
  }, { blocksBefore: [], blocksAfter: [] });
  const editorStateBefore = EditorState.createWithContent(ContentState.createFromBlockArray(
    blocksBefore,
    newContentState.getEntityMap(),
  ));
  const editorStateAfter = EditorState.createWithContent(ContentState.createFromBlockArray(
    blocksAfter,
    newContentState.getEntityMap(),
  ));
  const canvasBlocksBefore = convertToCanvasBlocks(editorStateBefore);
  const canvasBlocksAfter = convertToCanvasBlocks(editorStateAfter);
  newEditorState = convertToEditorState([
    ...canvasBlocksBefore,
    ...canvasBlocks,
    ...canvasBlocksAfter,
  ]);
  newEditorState = EditorState.push(
    editorState,
    newEditorState.getCurrentContent(),
  );
  newEditorState = selectBlock(
    newEditorState,
    (canvasBlocksBefore.length + canvasBlocks.length) - 1,
    selectionTypes.END,
  );
  return newEditorState;
};
