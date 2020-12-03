import getListBlocks from './getListBlocks';
import isBlockAList from './isBlockAList';

/**
 * Checks if the provided list block is the first in its list
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
  return getListBlocks(contentState, contentBlock)[0] === contentBlock;
};
