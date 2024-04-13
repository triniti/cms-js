import { ContentState } from 'draft-js';
import areKeysSame from '@triniti/cms/components/blocksmith-field/utils/areKeysSame';
import findBlock from '@triniti/cms/components/blocksmith-field/utils/findBlock';
import getBlockForKey from '@triniti/cms/components/blocksmith-field/utils/getBlockForKey';
import getListBlockNodes from '@triniti/cms/components/blocksmith-field/utils/getListBlockNodes';
import isBlockAList from '@triniti/cms/components/blocksmith-field/utils/isBlockAList';

/**
 * Moves a block to a position.
 *
 * @param {ContentState}           contentState - a ContentState instance of a DraftJs Editor
 * @param {(object|number|string)} id           - a block, a block index, or a block key
 * @param {string}                 position     - 'up' or 'down'
 *
 * @returns {ContentState} a ContentState instance
 */
export default (contentState, id, position) => {
  if (position !== 'up' && position !== 'down') {
    return contentState;
  }
  const block = findBlock(contentState, id);
  const blockIndex = contentState.getBlocksAsArray().indexOf(block);
  let insertionIndex = blockIndex + (position === 'up' ? -1 : 1);
  let blocksAsArray = [];
  if (isBlockAList(block)) {
    const nodes = getListBlockNodes(contentState, block);
    blocksAsArray = contentState.getBlocksAsArray().filter((b) => {
      let include = true;
      for (let i = 0; i < nodes.length; i += 1) {
        if (areKeysSame(nodes[i].getAttribute('data-offset-key'), b.getKey())) {
          include = false;
          break;
        }
      }
      return include;
    });
    const insertionBlock = contentState.getBlocksAsArray()[insertionIndex];
    if (isBlockAList(insertionBlock)) {
      const numberOfListBlocks = getListBlockNodes(contentState, insertionBlock).length;
      const nextBlockIndex = insertionIndex + (numberOfListBlocks - 1);
      if (isBlockAList(contentState.getBlocksAsArray()[nextBlockIndex])) {
        // this only happens when an unordered list is next to an ordered list. lists of the same
        // type merge into a single mega list, which is weird but thats the default draft behavior.
        if (position === 'up') {
          insertionIndex -= numberOfListBlocks - 1;
        } else {
          insertionIndex += numberOfListBlocks - 1;
        }
      }
    }
    const nodeBlocks = nodes.map((node) => getBlockForKey(contentState, node.getAttribute('data-offset-key')));
    blocksAsArray.splice(insertionIndex, 0, ...nodeBlocks);
  } else {
    blocksAsArray = contentState.getBlocksAsArray().filter((b) => b.getKey() !== block.getKey());
    const insertionBlock = contentState.getBlocksAsArray()[insertionIndex];
    if (isBlockAList(insertionBlock)) {
      const numberOfListBlocks = getListBlockNodes(contentState, insertionBlock).length;
      if (position === 'up') {
        insertionIndex -= numberOfListBlocks - 1;
      } else {
        insertionIndex += numberOfListBlocks - 1;
      }
    }
    blocksAsArray.splice(insertionIndex, 0, block);
  }
  return ContentState.createFromBlockArray(
    blocksAsArray,
    contentState.getEntityMap(),
  );
};
