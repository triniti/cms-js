import { ContentState, EditorState, genKey } from 'draft-js';
import areAllBlocksSelected from './areAllBlocksSelected';
import constants from '../components/blocksmith/constants';
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
  const selectedBlocksList = getSelectedBlocksList(newEditorState).toArray();
  if (!selectedBlocksList.length) {
    return newEditorState;
  }
  const wereAllBlocksSelected = areAllBlocksSelected(newEditorState);
  const firstSelectedBlock = selectedBlocksList[0];
  const blocks = newContentState.getBlocksAsArray();
  let block;
  let unselectedBlocksBeforeCount = 0;
  for (let i = 0; i < blocks.length; i += 1) {
    block = blocks[i];
    if (block.getKey() === firstSelectedBlock.getKey()) {
      unselectedBlocksBeforeCount = i === 0 ? i : i - 1;
      break;
    }
  }
  const selectedBlockKeys = selectedBlocksList.map((b) => b.getKey());
  newContentState = ContentState.createFromBlockArray(
    newContentState.getBlocksAsArray().filter((b) => !selectedBlockKeys.includes(b.getKey())),
    newContentState.getEntityMap(),
  );
  newEditorState = EditorState.push(
    newEditorState,
    newContentState,
  );
  const blockToSelectKey = wereAllBlocksSelected
    ? newContentState.getFirstBlock().getKey()
    : genKey();
  if (!wereAllBlocksSelected) {
    newEditorState = EditorState.push(
      newEditorState,
      insertEmptyBlock(
        newEditorState.getCurrentContent(),
        unselectedBlocksBeforeCount,
        constants.POSITION_AFTER,
        blockToSelectKey,
      ),
    );
  }
  return selectBlock(newEditorState, blockToSelectKey);
};
