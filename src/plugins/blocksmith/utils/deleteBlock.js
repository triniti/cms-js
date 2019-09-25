import { ContentState, EditorState } from 'draft-js';
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
    case 'atomic':
    case 'unstyled':
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
    case 'ordered-list-item':
    case 'unordered-list-item':
      newContentState = deleteListBlock(contentState, block.getKey());
      break;
    default:
      throw new Error(`delete not yet implemented for block type: ${block.getType()}`);
  }
  return newContentState;
};
