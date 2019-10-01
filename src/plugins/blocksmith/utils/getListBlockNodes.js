import blockParentNode from './blockParentNode';
import getBlockNode from './getBlockNode';
import findBlock from './findBlock';
import isBlockAList from './isBlockAList';

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
    throw new Error(`block with key [${block.getKey()}] is not a list block, bailing out`);
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
