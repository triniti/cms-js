import { ContentState, EditorState } from 'draft-js';
import getListBlocks from '@triniti/cms/blocksmith/utils/getListBlocks.js';

/**
 * Deletes a list block, which is to say deletes the set of adjacent ContentBlocks
 * of the same list type.
 *
 * @param {ContentState} contentState - a ContentState instance of a DraftJs Editor
 * @param {(object|number|string)} id - a block, a block index, or a block key
 *
 * @returns {ContentState} a ContentState instance
 */

export default (contentState, id) => {
  const listBlocks = getListBlocks(contentState, id);
  const newContentState = ContentState.createFromBlockArray(
    contentState.getBlocksAsArray()
      .filter((blockFromArray) => !listBlocks.includes(blockFromArray)),
    contentState.getEntityMap(),
  );

  if (newContentState.getBlocksAsArray().length) {
    return newContentState;
  }

  // the last block was deleted. start fresh with nothing and a blank entitymap
  const newEditorState = EditorState.createEmpty();
  return ContentState.createFromBlockArray(
    newEditorState.getCurrentContent().getBlocksAsArray(),
    newEditorState.getCurrentContent().getEntityMap(),
  );
};
