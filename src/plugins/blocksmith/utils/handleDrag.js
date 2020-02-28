/* eslint-disable import/no-useless-path-segments */
import { styleDragTarget, getDraggedBlockNode, handleDocumentDragover, handleDocumentDrop } from './';
import constants from '../components/blocksmith/constants';

let draggedBlockNode;

export const handleDragStart = (blockKey) => (event) => {
  draggedBlockNode = getDraggedBlockNode();
  event.dataTransfer.setDragImage(draggedBlockNode, 150, 35);
  event.dataTransfer.setData('block', `${constants.DRAFTJS_BLOCK_KEY}:${blockKey}`);
  document.querySelector('#block-editor').addEventListener('dragover', styleDragTarget);
  document.addEventListener('dragover', handleDocumentDragover);
  // callback function needs to be written this way to be called
  document.addEventListener('drop', (e) => handleDocumentDrop(e));
};

export const handleDragEnd = () => {
  if (draggedBlockNode) {
    draggedBlockNode.style.opacity = 1;
  }
};
