/* eslint-disable import/no-useless-path-segments */
import { blockParentNode, getDraggedBlockNode } from '@triniti/cms/components/blocksmith-field/utils/index';
import { removeOldInsertBlockMarkerNode } from '@triniti/cms/components/blocksmith-field/utils/styleDragTarget';

/**
 * Cleans up editor/drag n drop state when a block is dragged outside of the editor. Included
 * as a function here so it will have a reference and can later be removed.
 *
 * @param {*} e - an event
 */
export default (e) => {
  e.preventDefault();
  const { pageX, pageY } = e;
  const editor = document.querySelector('#block-editor');
  const rect = editor.getBoundingClientRect();
  if ((pageY > rect.bottom || pageY < rect.top) || (pageX < rect.left || pageX > rect.right)) {
    let draggedBlock = getDraggedBlockNode();
    if (!draggedBlock) {
      return;
    }
    while (!blockParentNode.is(draggedBlock.parentNode)) {
      draggedBlock = draggedBlock.parentNode;
    }
    draggedBlock.classList.remove('hidden-block');
    removeOldInsertBlockMarkerNode();
  }
};
