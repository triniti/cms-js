import { ContentState } from 'draft-js';
import getListBlocks from './getListBlocks';

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
  return ContentState.createFromBlockArray(
    contentState.getBlocksAsArray().filter((blockFromArray) => !listBlocks.includes(blockFromArray)),
    contentState.getEntityMap(),
  );
};
