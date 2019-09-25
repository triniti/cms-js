import constants from '../components/blocksmith/constants';
import areKeysSame from './areKeysSame';
/* eslint-disable import/no-useless-path-segments */
import { blockParentNode, getDraggedBlockNode, getInsertBlockMarkerNode, preventDefault } from './';

let cache;

export const removeOldInsertBlockMarkerNode = () => {
  const oldInsertBlockMarkerNode = getInsertBlockMarkerNode();
  if (oldInsertBlockMarkerNode) {
    oldInsertBlockMarkerNode.remove();
  }
};

const insertBlockMarkerFn = (
  insertBlockMarkerNode,
  dropTarget,
  isOverTopHalfOfDropTarget,
  draggedBlock,
) => {
  removeOldInsertBlockMarkerNode();

  if (dropTarget.tagName === 'OL' || dropTarget.tagName === 'UL') {
    insertBlockMarkerNode.setAttribute('data-drop-target-is-list', 'true');
  } else {
    insertBlockMarkerNode.setAttribute('data-drop-target-is-list', 'false');
  }

  const insertBlockMarkerLineKey = insertBlockMarkerNode.getAttribute('data-offset-key');
  let sibling;
  let position;
  let insertNode;
  if (isOverTopHalfOfDropTarget) {
    sibling = dropTarget.previousSibling;
    position = constants.POSITION_ABOVE;
    insertNode = dropTarget;
  } else {
    sibling = dropTarget.nextSibling;
    position = constants.POSITION_BELOW;
    insertNode = dropTarget.nextSibling;
  }

  const siblingKey = sibling ? sibling.getAttribute('data-offset-key') : null;
  if (!sibling || !areKeysSame(siblingKey, insertBlockMarkerLineKey)) {
    insertBlockMarkerNode.setAttribute('data-drop-target-position', position);
    dropTarget.parentNode.insertBefore(insertBlockMarkerNode, insertNode);
    draggedBlock.classList.add('hidden-block');
  } else {
    draggedBlock.classList.remove('hidden-block');
  }
};

const styleElement = (
  dragX,
  dragY,
  insertBlockMarkerNode,
  draggedBlock,
  isDraggedBlockAList,
  listBlockKeys,
) => {
  const draggedBlockKey = draggedBlock.getAttribute('data-offset-key');
  let dropTarget = document.elementFromPoint(dragX, dragY);

  if (dropTarget.parentNode.tagName === 'FIGURE') { // atomic blocks are figures
    dropTarget = dropTarget.parentNode;
  }

  if (!dropTarget.hasAttribute('data-offset-key')) {
    return; // not a valid drop target
  }

  while (!blockParentNode.is(dropTarget.parentNode)) {
    if (!dropTarget.parentNode) {
      return; // not a valid drop target
    }
    dropTarget = dropTarget.parentNode;
  }
  const dropTargetKey = dropTarget.getAttribute('data-offset-key');
  if (isDraggedBlockAList) {
    for (let i = 0; i < listBlockKeys.length; i += 1) {
      if (areKeysSame(dropTargetKey, listBlockKeys[i])) {
        return; // dragging over self
      }
    }
  }

  if (
    dropTarget.hasAttribute('data-offset-key')
    && areKeysSame(dropTarget.getAttribute('data-offset-key'), draggedBlockKey)
  ) {
    return; // item being dragged would be placed where it already is
  }

  if (isDraggedBlockAList) {
    insertBlockMarkerNode.setAttribute('data-drag-block-list-keys', listBlockKeys.join(':'));
  }
  insertBlockMarkerNode.setAttribute('data-drop-target-key', dropTargetKey);

  const rect = dropTarget.getBoundingClientRect();
  const isOverTopHalfOfDropTarget = (dragY - rect.top) < (rect.bottom - dragY);

  insertBlockMarkerFn(
    insertBlockMarkerNode,
    dropTarget,
    isOverTopHalfOfDropTarget,
    draggedBlock,
  );
};

export const clearDragCache = () => {
  cache = undefined;
};

export default (e = window.event) => {
  const dragX = e.pageX;
  const dragY = e.pageY;

  if (cache) {
    const {
      insertBlockMarkerNode,
      draggedBlock,
      isDraggedBlockAList,
      listBlockKeys,
    } = cache;

    styleElement(
      dragX,
      dragY,
      insertBlockMarkerNode,
      draggedBlock,
      isDraggedBlockAList,
      listBlockKeys,
    );
  } else {
    let isDraggedBlockAList = false;
    const listBlockKeys = [];

    let draggedBlock = getDraggedBlockNode();
    while (!blockParentNode.is(draggedBlock.parentNode)) {
      draggedBlock = draggedBlock.parentNode;
    }
    const draggedBlockTagName = draggedBlock.tagName;
    if (draggedBlockTagName === 'OL' || draggedBlockTagName === 'UL') {
      isDraggedBlockAList = true;
      Array.from(draggedBlock.children).forEach((child) => {
        listBlockKeys.push(child.getAttribute('data-offset-key'));
      });
    }

    const insertBlockMarkerNode = document.createElement('div');
    insertBlockMarkerNode.setAttribute('id', constants.INSERT_BLOCK_MARKER_ID);
    insertBlockMarkerNode.setAttribute('class', 'insert-marker');
    insertBlockMarkerNode.addEventListener('dragover', preventDefault);
    insertBlockMarkerNode.setAttribute('data-offset-key', draggedBlock.getAttribute('data-offset-key'));

    cache = {};
    cache.insertBlockMarkerNode = insertBlockMarkerNode;
    cache.draggedBlock = draggedBlock;
    cache.isDraggedBlockAList = isDraggedBlockAList;
    cache.listBlockKeys = listBlockKeys;

    styleElement(
      dragX,
      dragY,
      insertBlockMarkerNode,
      draggedBlock,
      isDraggedBlockAList,
      listBlockKeys,
    );
  }
};
