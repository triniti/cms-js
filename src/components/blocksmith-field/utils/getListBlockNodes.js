import blockParentNode from '@triniti/cms/components/blocksmith-field/utils/blockParentNode';
import getBlockNode from '@triniti/cms/components/blocksmith-field/utils/getBlockNode';
import findBlock from '@triniti/cms/components/blocksmith-field/utils/findBlock';
import isBlockAList from '@triniti/cms/components/blocksmith-field/utils/isBlockAList';

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
