import { ContentBlock, ContentState, genKey } from 'draft-js';
import { List } from 'immutable';
import { blockTypes } from '../constants';
import constants from '../components/blocksmith/constants';
import findBlock from './findBlock';
import getListBlocks from './getListBlocks';
import isBlockAList from './isBlockAList';
import normalizeKey from './normalizeKey';

/* eslint-disable max-len */
/**
 * Given a block's key, inserts an empty block before or after that block.
 *
 * @param {ContentState}                 contentState          - a ContentState instance of a DraftJs Editor
 * @param {(ContentBlock|number|string)} insertionPointBlockId - a block, a block index, or a block key
 * @param {Symbol}                       position              - POSITION_BEFORE or POSITION_AFTER
 * @param {?string}                      newBlockKey           - a block key to use for the new block
 *
 * @returns {ContentState} a ContentState instance
 */
/* eslint-enable max-len */
export default (contentState, insertionPointBlockId, position, newBlockKey = genKey()) => {
  if (position !== constants.POSITION_BEFORE && position !== constants.POSITION_AFTER) {
    throw new Error('You must provide a valid insertion position.');
  }
  let newBlocksAsArray = [];
  const emptyBlock = new ContentBlock({
    key: normalizeKey(newBlockKey),
    type: blockTypes.UNSTYLED,
    text: '',
    characterList: new List([]),
  });
  if (!contentState.getBlocksAsArray().length) {
    newBlocksAsArray.push(emptyBlock);
  } else {
    let insertionPointBlock = findBlock(contentState, insertionPointBlockId);
    if (isBlockAList(insertionPointBlock)) {
      const [finalListBlockNode] = getListBlocks(contentState, insertionPointBlock).slice(-1);
      insertionPointBlock = findBlock(contentState, finalListBlockNode.getKey());
    }
    const blocksAsArray = contentState.getBlocksAsArray();
    const blockIndex = blocksAsArray.indexOf(insertionPointBlock);
    const offset = position === constants.POSITION_AFTER ? 1 : 0;
    newBlocksAsArray = blocksAsArray
      .slice(0, blockIndex + offset)
      .concat([emptyBlock])
      .concat(blocksAsArray.slice(blockIndex + offset, blocksAsArray.length));
  }
  return ContentState.createFromBlockArray(
    newBlocksAsArray,
    contentState.getEntityMap(),
  );
};
