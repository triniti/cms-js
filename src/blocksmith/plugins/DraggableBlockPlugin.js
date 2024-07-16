/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  $getNearestNodeFromDOMNode,
  $getNodeByKey,
  $getRoot,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  DRAGOVER_COMMAND,
  DROP_COMMAND,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { calculateZoomLevel, isHTMLElement, mergeRegister } from '@lexical/utils';
import { Point } from '@triniti/cms/blocksmith/utils/point.js';
import { Rect } from '@triniti/cms/blocksmith/utils/rect.js';

const SPACE = 1;
const TARGET_LINE_HALF_HEIGHT = 2;
const DRAGGABLE_BLOCK_MENU_CLASSNAME = 'draggable-block-menu';
const DRAG_DATA_FORMAT = 'application/x-lexical-drag-block';
const TEXT_BOX_HORIZONTAL_PADDING = 10;

const Downward = 1;
const Upward = -1;
const Indeterminate = 0;

let prevIndex = Infinity;

const getCurrentIndex = (keysLength) => {
  if (keysLength === 0) {
    return Infinity;
  }
  if (prevIndex >= 0 && prevIndex < keysLength) {
    return prevIndex;
  }

  return Math.floor(keysLength / 2);
};

const getTopLevelNodeKeys = (editor) => {
  return editor.getEditorState().read(() => $getRoot().getChildrenKeys());
};

const getCollapsedMargins = (elem) => {
  const getMargin = (element, margin) => element ? parseFloat(window.getComputedStyle(element)[margin]) : 0;
  const { marginTop, marginBottom } = window.getComputedStyle(elem);
  const prevElemSiblingMarginBottom = getMargin(elem.previousElementSibling, 'marginBottom');
  const nextElemSiblingMarginTop = getMargin(elem.nextElementSibling, 'marginTop');
  const collapsedTopMargin = Math.max(parseFloat(marginTop), prevElemSiblingMarginBottom);
  const collapsedBottomMargin = Math.max(parseFloat(marginBottom), nextElemSiblingMarginTop);
  return { marginBottom: collapsedBottomMargin, marginTop: collapsedTopMargin };
};

const getBlockElement = (anchorElem, editor, event, useEdgeAsDefault = false) => {
  const anchorElementRect = anchorElem.getBoundingClientRect();
  const topLevelNodeKeys = getTopLevelNodeKeys(editor);
  let blockElem = null;

  editor.getEditorState().read(() => {
    if (useEdgeAsDefault) {
      const [firstNode, lastNode] = [
        editor.getElementByKey(topLevelNodeKeys[0]),
        editor.getElementByKey(topLevelNodeKeys[topLevelNodeKeys.length - 1])
      ];

      const [firstNodeRect, lastNodeRect] = [
        firstNode?.getBoundingClientRect(),
        lastNode?.getBoundingClientRect()
      ];

      if (firstNodeRect && lastNodeRect) {
        const firstNodeZoom = calculateZoomLevel(firstNode);
        const lastNodeZoom = calculateZoomLevel(lastNode);
        if (event.y / firstNodeZoom < firstNodeRect.top) {
          blockElem = firstNode;
        } else if (event.y / lastNodeZoom > lastNodeRect.bottom) {
          blockElem = lastNode;
        }

        if (blockElem) {
          return;
        }
      }
    }

    let index = getCurrentIndex(topLevelNodeKeys.length);
    let direction = Indeterminate;

    while (index >= 0 && index < topLevelNodeKeys.length) {
      const key = topLevelNodeKeys[index];
      const elem = editor.getElementByKey(key);
      if (elem === null) {
        break;
      }

      const zoom = calculateZoomLevel(elem);
      const point = new Point(event.x / zoom, event.y / zoom);
      const domRect = Rect.fromDOM(elem);
      const { marginTop, marginBottom } = getCollapsedMargins(elem);
      const rect = domRect.generateNewRect({
        bottom: domRect.bottom + marginBottom,
        left: anchorElementRect.left,
        right: anchorElementRect.right,
        top: domRect.top - marginTop,
      });

      const { result, reason: { isOnTopSide, isOnBottomSide } } = rect.contains(point);
      if (result) {
        blockElem = elem;
        prevIndex = index;
        break;
      }

      if (direction === Indeterminate) {
        if (isOnTopSide) {
          direction = Upward;
        } else if (isOnBottomSide) {
          direction = Downward;
        } else {
          // stop search block element
          direction = Infinity;
        }
      }

      index += direction;
    }
  });

  return blockElem;
};

const isOnMenu = (element) => {
  return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
};

const setMenuPosition = (targetElem, floatingElem, anchorElem) => {
  if (!targetElem) {
    floatingElem.style.opacity = '0';
    floatingElem.style.transform = 'translate(-10000px, -10000px)';
    return;
  }

  const targetRect = targetElem.getBoundingClientRect();
  const targetStyle = window.getComputedStyle(targetElem);
  const floatingElemRect = floatingElem.getBoundingClientRect();
  const anchorElementRect = anchorElem.getBoundingClientRect();

  const top =
    targetRect.top +
    (parseInt(targetStyle.lineHeight, 10) - floatingElemRect.height) / 2 -
    anchorElementRect.top;

  const left = SPACE;
  floatingElem.style.opacity = '1';
  floatingElem.style.transform = `translate(${left}px, ${top}px)`;
};

const setDragImage = (dataTransfer, draggableBlockElem) => {
  const { transform } = draggableBlockElem.style;

  // Remove dragImage borders
  draggableBlockElem.style.transform = 'translateZ(0)';
  dataTransfer.setDragImage(draggableBlockElem, 0, 0);

  setTimeout(() => {
    draggableBlockElem.style.transform = transform;
  });
};

const setTargetLine = (targetLineElem, targetBlockElem, mouseY, anchorElem) => {
  const { top: targetBlockElemTop, height: targetBlockElemHeight } = targetBlockElem.getBoundingClientRect();
  const { top: anchorTop, width: anchorWidth } = anchorElem.getBoundingClientRect();
  const { marginTop, marginBottom } = getCollapsedMargins(targetBlockElem);
  let lineTop = targetBlockElemTop;
  if (mouseY >= targetBlockElemTop) {
    lineTop += targetBlockElemHeight + marginBottom / 2;
  } else {
    lineTop -= marginTop / 2;
  }

  const top = lineTop - anchorTop - TARGET_LINE_HALF_HEIGHT;
  const left = TEXT_BOX_HORIZONTAL_PADDING - SPACE;

  targetLineElem.style.transform = `translate(${left}px, ${top}px)`;
  targetLineElem.style.width = `${anchorWidth - (TEXT_BOX_HORIZONTAL_PADDING - SPACE) * 2}px`;
  targetLineElem.style.opacity = '.4';
}

const hideTargetLine = (targetLineElem) => {
  if (targetLineElem) {
    targetLineElem.style.opacity = '0';
    targetLineElem.style.transform = 'translate(-10000px, -10000px)';
  }
};

export default function DraggableBlockPlugin({ anchorElem }) {
  const [editor] = useLexicalComposerContext();
  const scrollerElem = anchorElem.parentElement;

  const menuRef = useRef(null);
  const targetLineRef = useRef(null);
  const isDraggingBlockRef = useRef(false);
  const [draggableBlockElem, setDraggableBlockElem] = useState(null);

  useEffect(() => {
    const onMouseMove = (event) => {
      const target = event.target;
      if (!isHTMLElement(target)) {
        setDraggableBlockElem(null);
        return;
      }

      if (isOnMenu(target)) {
        return;
      }

      setDraggableBlockElem(getBlockElement(anchorElem, editor, event));
    };

    const onMouseLeave = () => setDraggableBlockElem(null);
    scrollerElem?.addEventListener('mousemove', onMouseMove);
    scrollerElem?.addEventListener('mouseleave', onMouseLeave);

    return () => {
      scrollerElem?.removeEventListener('mousemove', onMouseMove);
      scrollerElem?.removeEventListener('mouseleave', onMouseLeave);
    }
  }, [scrollerElem, anchorElem, editor]);

  useEffect(() => {
    if (menuRef.current) {
      setMenuPosition(draggableBlockElem, menuRef.current, anchorElem);
    }
  }, [anchorElem, draggableBlockElem]);

  useEffect(() => {
    const onDragover = (event) => {
      if (!isDraggingBlockRef.current) {
        return false;
      }

      const { pageY, target } = event;
      if (!isHTMLElement(target)) {
        return false;
      }

      const targetBlockElem = getBlockElement(anchorElem, editor, event, true);
      const targetLineElem = targetLineRef.current;
      if (targetBlockElem === null || targetLineElem === null) {
        return false;
      }

      setTargetLine(targetLineElem, targetBlockElem, pageY / calculateZoomLevel(target), anchorElem);
      // Prevent default event to be able to trigger onDrop events
      event.preventDefault();
      return true;
    };

    const $onDrop = (event) => {
      if (!isDraggingBlockRef.current) {
        return false;
      }

      const { target, dataTransfer, pageY } = event;
      const dragData = dataTransfer?.getData(DRAG_DATA_FORMAT) || '';
      const draggedNode = $getNodeByKey(dragData);
      if (!draggedNode) {
        return false;
      }

      if (!isHTMLElement(target)) {
        return false;
      }

      const targetBlockElem = getBlockElement(anchorElem, editor, event, true);
      if (!targetBlockElem) {
        return false;
      }

      const targetNode = $getNearestNodeFromDOMNode(targetBlockElem);
      if (!targetNode) {
        return false;
      }

      if (targetNode === draggedNode) {
        return true;
      }

      const targetBlockElemTop = targetBlockElem.getBoundingClientRect().top;
      if (pageY / calculateZoomLevel(target) >= targetBlockElemTop) {
        targetNode.insertAfter(draggedNode);
      } else {
        targetNode.insertBefore(draggedNode);
      }

      setDraggableBlockElem(null);
      return true;
    };

    return mergeRegister(
      editor.registerCommand(DRAGOVER_COMMAND, event => onDragover(event), COMMAND_PRIORITY_LOW),
      editor.registerCommand(DROP_COMMAND, event => $onDrop(event), COMMAND_PRIORITY_HIGH)
    );
  }, [anchorElem, editor]);

  const onDragStart = (event) => {
    const dataTransfer = event.dataTransfer;
    if (!dataTransfer || !draggableBlockElem) {
      return;
    }

    setDragImage(dataTransfer, draggableBlockElem);
    let nodeKey = '';
    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(draggableBlockElem);
      if (node) {
        nodeKey = node.getKey();
      }
    });
    isDraggingBlockRef.current = true;
    dataTransfer.setData(DRAG_DATA_FORMAT, nodeKey);
  };

  const onDragEnd = () => {
    isDraggingBlockRef.current = false;
    hideTargetLine(targetLineRef.current);
  };

  if (!editor.isEditable()) {
    return null;
  }

  return createPortal(
    <>
      <div
        className="iconwtf draggable-block-menu"
        ref={menuRef}
        draggable={true}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="icon" />
      </div>
      <div className="draggable-block-target-line" ref={targetLineRef} />
    </>,
    anchorElem
  );
}
