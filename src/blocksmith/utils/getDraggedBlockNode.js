import constants from '@triniti/cms/blocksmith/constants.js';
import normalizeKey from '@triniti/cms/blocksmith/utils/normalizeKey.js';

/**
 * Gets the dragged block node
 *
 * @returns {*} the block parent node
 */
export default () => {
  const dragHandleNode = document.querySelector(`#${constants.DRAG_BUTTON_ID}`);
  if (!dragHandleNode) {
    return null;
  }
  if (!dragHandleNode.hasAttribute('data-dragged-block-key')) {
    return null;
  }
  const draggedBlockKey = dragHandleNode.getAttribute('data-dragged-block-key');
  const draggedBlockNode = document.querySelector(`[data-offset-key="${normalizeKey(draggedBlockKey)}-0-0"]`);
  if (!draggedBlockNode) {
    return null;
  }
  return draggedBlockNode;
};
