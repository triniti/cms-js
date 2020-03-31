import { ContentBlock } from 'draft-js';
import getBlockForKey from './getBlockForKey';

/**
 * Internal util for resolving various block identifiers to actual ContentBlocks
 *
 * @param {ContentState}                 contentState - a ContentState instance of a DraftJs Editor
 * @param {(ContentBlock|number|string)} id           - a block, a block index, or a block key
 *
 * @returns {boolean}
 */
export default (contentState, id) => {
  let block;
  switch (typeof id) {
    case 'number':
      block = contentState.getBlocksAsArray()[id];
      if (typeof block === 'undefined') {
        throw new Error(`there is no block for index [${id}]`);
      }
      break;
    case 'string':
      block = getBlockForKey(contentState, id);
      if (!block) {
        throw new Error(`there is no block for key [${id}]`);
      }
      break;
    case 'object':
      if (id instanceof ContentBlock) {
        block = id;
      } else {
        throw new Error('provided block object is not a ContentBlock');
      }
      break;
    default:
      throw new Error(`unable to find block with provided id [${id}]`);
  }
  return block;
};
