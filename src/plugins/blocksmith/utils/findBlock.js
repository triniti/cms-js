import { ContentBlock } from 'draft-js';
import getBlockForKey from './getBlockForKey';

/**
 * Internal util for resolving various block identifiers to actual ContentBlocks
 *
 * @param {ContentState}                 contentState - a ContentState instance of a DraftJs Editor
 * @param {(ContentBlock|number|string)} id           - a block, a block index, or a block key
 *
 * @returns {?ContentBlock}
 */
export default (contentState, id) => {
  let block;
  switch (typeof id) {
    case 'number':
      block = contentState.getBlocksAsArray()[id];
      break;
    case 'string':
      block = getBlockForKey(contentState, id);
      break;
    case 'object':
      if (id instanceof ContentBlock) {
        block = id;
      }
      break;
    default:
      break;
  }
  if (!block) {
    debugger; // eslint-disable-line
  }
  return block;
};
