import isBlockAList from '@triniti/cms/components/blocksmith-field/utils/isBlockAList.js';

/**
 * Since our "list" blocks are a single canvas block, but draft treats them as separate
 * ContentBlocks, we have to figure out the index offset for later retrieving the correct
 * data payload from draft.
 *
  * @param {Array} draftJsBlocks
  *
  * @return {Array}
 */
export default (draftJsBlocks) => {
  let currentOffset = 0;
  let previousType = null;
  const indexOffsets = draftJsBlocks.reduce((acc, cur) => {
    if (!isBlockAList(cur)) {
      acc.push(currentOffset);
      previousType = cur.getType();
      return acc;
    }
    if (previousType === cur.getType()) {
      currentOffset += 1;
      return acc;
    }
    if (previousType !== null) {
      acc.push(currentOffset);
    }
    previousType = cur.getType();
    return acc;
  }, []);
  if (!indexOffsets.length) {
    indexOffsets.push(0);
  }
  return indexOffsets;
};
