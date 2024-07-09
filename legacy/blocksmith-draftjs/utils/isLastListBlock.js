import getListBlocks from '@triniti/cms/blocksmith/utils/getListBlocks.js';
import isBlockAList from '@triniti/cms/blocksmith/utils/isBlockAList.js';

/**
 * Checks if the provided list block is the last in its list
 *
 * @param {ContentState} contentState - a state instance of a DraftJs Editor
 * @param {ContentBlock} contentBlock - a DraftJs ContentBlock
 *
 * @returns {boolean}
 */
export default (contentState, contentBlock) => {
  if (!isBlockAList(contentBlock)) {
    return false;
  }
  const listBlocks = getListBlocks(contentState, contentBlock);
  return listBlocks[listBlocks.length - 1] === contentBlock;
};
