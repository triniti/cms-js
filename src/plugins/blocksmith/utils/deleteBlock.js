import { ContentState, EditorState } from 'draft-js';
import { blockTypes } from '../constants';
import deleteListBlock from './deleteListBlock';
import findBlock from './findBlock';

/**
 * Deletes a block
 *
 * @param {ContentState} contentState - a ContentState instance of a DraftJs Editor
 * @param {(object|number|string)} id - a block, a block index, or a block key
 *
 * @returns {ContentState} a ContentState instance
 */
export default (contentState, id) => {
  const block = findBlock(contentState, id);
  let newContentState;
  switch (block.getType()) {
    case blockTypes.ATOMIC:
    case blockTypes.UNSTYLED:
      newContentState = ContentState.createFromBlockArray(
        contentState.getBlocksAsArray().filter((b) => b !== block),
        contentState.getEntityMap(),
      );
      if (!newContentState.getBlocksAsArray().length) {
        // the last block was deleted. start fresh with nothing and a blank entitymap
        const newEditorState = EditorState.createEmpty();
        newContentState = ContentState.createFromBlockArray(
          newEditorState.getCurrentContent().getBlocksAsArray(),
          newEditorState.getCurrentContent().getEntityMap(),
        );
      }
      break;
    case blockTypes.ORDERED_LIST_ITEM:
    case blockTypes.UNORDERED_LIST_ITEM:
      newContentState = deleteListBlock(contentState, block.getKey());
      break;
    default:
      return contentState;
  }
  return newContentState;
};
