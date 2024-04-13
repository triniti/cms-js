import { ContentState } from 'draft-js';
import constants from '@triniti/cms/components/blocksmith-field/constants';
import areKeysSame from '@triniti/cms/components/blocksmith-field/utils/areKeysSame';
import getBlockForKey from '@triniti/cms/components/blocksmith-field/utils/getBlockForKey';
import getBlockNode from '@triniti/cms/components/blocksmith-field/utils/getBlockNode';

/**
 * Reorders blocks after a drag and drop
 *
 * @param {ContentState} contentState         - a state instance of a DraftJs Editor
 * @param {string}       draggedBlockKey      - the key of the block being dragged
 * @param {string}       dropTargetKey        - the key of the block being dropped onto
 * @param {string}       dropTargetPosition   - the position (above/below) the block is
 *                                              being dropped into
 * @param {boolean}      isDropTargetAList    - whether or not the drop target is a list
 * @param {?array}       draggedBlockListKeys - if the dragged block is a list, this is
 *                                              an array of all the keys in that list
 *
 * @returns {ContentState}
 */

export default (
  contentState,
  draggedBlockKey,
  dropTargetKey,
  dropTargetPosition,
  isDropTargetAList,
  draggedBlockListKeys,
) => {
  let positionModifier = dropTargetPosition === constants.POSITION_ABOVE ? 0 : 1;

  let draggedBlocks = [];
  let newContentState;
  let nonDraggedBlocks;
  if (draggedBlockListKeys) {
    draggedBlockListKeys.forEach((key) => {
      draggedBlocks.push(getBlockForKey(contentState, key));
    });
    nonDraggedBlocks = contentState.getBlocksAsArray().filter((draftBlock) => {
      let isNonDraggedBlock = true;
      for (let i = 0; i < draggedBlockListKeys.length; i += 1) {
        if (areKeysSame(draftBlock.getKey(), draggedBlockListKeys[i])) {
          isNonDraggedBlock = false;
        }
      }
      return isNonDraggedBlock;
    });
  } else {
    draggedBlocks = [getBlockForKey(contentState, draggedBlockKey)];
    nonDraggedBlocks = contentState.getBlocksAsArray()
      .filter((draftBlock) => draftBlock !== draggedBlocks[0]);
  }

  for (let i = 0; i < nonDraggedBlocks.length; i += 1) {
    if (areKeysSame(nonDraggedBlocks[i].getKey(), dropTargetKey)) {
      if (isDropTargetAList) {
        const numberOfListItems = getBlockNode(contentState, dropTargetKey).children.length;
        if (dropTargetPosition === constants.POSITION_BELOW) {
          positionModifier += (numberOfListItems - 1);
        }
      }
      const blocksBefore = nonDraggedBlocks.slice(0, i + positionModifier);
      const blocksAfter = nonDraggedBlocks.slice(i + positionModifier, nonDraggedBlocks.length);
      const reorderedBlocks = blocksBefore
        .concat(draggedBlocks)
        .concat(blocksAfter);

      newContentState = ContentState.createFromBlockArray(
        reorderedBlocks,
        contentState.getEntityMap(),
      );
      break;
    }
  }
  return newContentState;
};
