import findBlock from './findBlock';
import isBlockAList from './isBlockAList';

/**
 * Given a list block or list block identifier, returns entire list
 *
 * @param {ContentState}           contentState - a state instance of a DraftJs Editor
 * @param {(object|number|string)} id           - a block, a block index, or a block key
 *
 * @returns {[]} entire set (adjacent of same type) of list (ordered/unordered) contentBlocks
 */

export default (contentState, id) => {
  const block = findBlock(contentState, id);
  if (!isBlockAList(block)) {
    throw new Error(`block with key [${block.getKey()}] is not a list block, bailing out`);
  }
  const listBlocks = [];

  // first start going backwards until you find one of a different type
  let blockBefore = contentState.getBlockBefore(block.getKey());
  while (blockBefore && blockBefore.getType() === block.getType()) {
    listBlocks.unshift(blockBefore);
    blockBefore = contentState.getBlockBefore(blockBefore.getKey());
  }

  listBlocks.push(block);

  // then go forward until you find one of a different type
  let blockAfter = contentState.getBlockAfter(block.getKey());
  while (blockAfter && blockAfter.getType() === block.getType()) {
    listBlocks.push(blockAfter);
    blockAfter = contentState.getBlockAfter(blockAfter.getKey());
  }

  return listBlocks;
};
