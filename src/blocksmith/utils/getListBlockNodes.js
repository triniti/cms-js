import blockParentNode from '@triniti/cms/blocksmith/utils/blockParentNode.js';
import getBlockNode from '@triniti/cms/blocksmith/utils/getBlockNode.js';
import findBlock from '@triniti/cms/blocksmith/utils/findBlock.js';
import isBlockAList from '@triniti/cms/blocksmith/utils/isBlockAList.js';

/**
 * Gets all list block dom nodes for a given list block.
 *
 * @param {ContentState}           contentState - a state instance of a DraftJs Editor
 * @param {(object|number|string)} id           - a block, a block index, or a block key
 *
 * @returns {[]} list block nodes
 */
export default (contentState, id) => {
  const block = findBlock(contentState, id);
  if (!isBlockAList(block)) {
    return [];
  }
  const listBlockNodes = [];
  let listBlockNode = document.querySelector(`[data-offset-key="${block.getKey()}-0-0"]`);
  while (!blockParentNode.is(listBlockNode.parentNode)) {
    listBlockNode = listBlockNode.parentNode;
  }
  Array.from(listBlockNode.children).forEach((child) => {
    listBlockNodes.push(getBlockNode(contentState, child.getAttribute('data-offset-key')));
  });
  return listBlockNodes;
};
