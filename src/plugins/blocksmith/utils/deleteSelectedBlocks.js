import { EditorState, genKey } from 'draft-js';
import constants from '../components/blocksmith/constants';
import deleteBlock from './deleteBlock';
import getSelectedBlocksList from './getSelectedBlocksList';
import insertEmptyBlock from './insertEmptyBlock';
import selectBlock from './selectBlock';

/**
 * Deletes all blocks included in selectionState.
 *
 * @param {EditorState} editorState - a state instance of a DraftJs Editor
 *
 * @returns {EditorState}
 */
export default (editorState) => {
  let newEditorState = editorState;
  let newContentState = editorState.getCurrentContent();
  const selectedBlocksList = getSelectedBlocksList(editorState).toArray();
  if (!selectedBlocksList.length) {
    return newEditorState;
  }
  const firstSelectedBlock = selectedBlocksList[0];
  const blocks = newContentState.getBlocksAsArray();
  let block;
  let unselectedBlocksBeforeCount = 0;
  for (let i = 0; i < blocks.length; i += 1) {
    block = blocks[i];
    if (block.getKey() === firstSelectedBlock.getKey()) {
      unselectedBlocksBeforeCount = i;
      break;
    }
  }
  selectedBlocksList.forEach((selectedBlock) => {
    newContentState = deleteBlock(newContentState, selectedBlock.getKey());
  });
  newEditorState = EditorState.push(
    newEditorState,
    newContentState,
  );
  const newBlockKey = genKey();
  newEditorState = EditorState.push(
    newEditorState,
    insertEmptyBlock(
      newEditorState.getCurrentContent(),
      unselectedBlocksBeforeCount,
      constants.POSITION_BEFORE,
      newBlockKey,
    ),
  );
  return selectBlock(newEditorState, newBlockKey);
};