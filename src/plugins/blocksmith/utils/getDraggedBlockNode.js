import constants from '../components/blocksmith/constants';
import normalizeKey from './normalizeKey';

/**
 * Gets the dragged block node
 *
 * @returns {*} the block parent node
 */

export default () => {
  const dragHandleNode = document.querySelector(`#${constants.DRAG_BUTTON_ID}`);
  if (!dragHandleNode) {
    throw new Error('unable to find handle node, which has the dragged key as an attribute');
  }
  if (!dragHandleNode.hasAttribute('data-dragged-block-key')) {
    throw new Error('handle node does not have dragged key attribute');
  }
  const draggedBlockKey = dragHandleNode.getAttribute('data-dragged-block-key');
  const draggedBlockNode = document.querySelector(`[data-offset-key="${normalizeKey(draggedBlockKey)}-0-0"]`);
  if (!draggedBlockNode) {
    throw new Error(`unable to find dragged block node using key [${draggedBlockKey}]`);
  }
  return draggedBlockNode;
};
