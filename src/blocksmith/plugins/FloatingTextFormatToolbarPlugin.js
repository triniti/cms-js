import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  $isListNode,
  ListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND
} from '@lexical/list';
import { Icon } from '@triniti/cms/components/index.js';
import $getSelectedNode from '@triniti/cms/blocksmith/utils/getSelectedNode.js';
import LinkModal from '@triniti/cms/blocksmith/components/link-modal/index.js';
import BlocksmithModal from '@triniti/cms/blocksmith/components/blocksmith-modal/index.js';

function getDOMRangeRect(nativeSelection, rootElement) {
  if (nativeSelection.rangeCount === 0) {
    return null;
  }

  const domRange = nativeSelection.getRangeAt(0);
  let rect;

  if (nativeSelection.anchorNode === rootElement) {
    let inner = rootElement;
    while (inner.firstElementChild != null) {
      inner = inner.firstElementChild;
    }
    rect = inner.getBoundingClientRect();
  } else {
    rect = domRange.getBoundingClientRect();
  }

  return rect;
}

const VERTICAL_GAP = 10;
const HORIZONTAL_OFFSET = 10;
const DEFAULT_TOOLBAR_HEIGHT = 50;

function FloatingTextFormatToolbar({
  editor,
  anchorElem,
  isLink,
  isBold,
  isItalic,
  isUnderline,
  isStrikethrough,
  isHighlight,
  blockType,
}) {
  const popupRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isBulletList = blockType === 'bullet';
  const isNumberList = blockType === 'number';

  const $updateTextFormatFloatingToolbar = useCallback(() => {
    const nativeSelection = window.getSelection();
    const popupElem = popupRef.current;
    const rootElement = editor.getRootElement();

    const hidePopup = () => {
      popupElem.style.opacity = '0';
      popupElem.style.top = '-1000px';
      popupElem.style.left = '-1000px';
    };

    if (!popupElem) return;

    // Early return if no valid selection
    if (!nativeSelection || nativeSelection.isCollapsed || !rootElement?.contains(nativeSelection.anchorNode)) {
      hidePopup();
      return;
    }

    const rangeRect = getDOMRangeRect(nativeSelection, rootElement);
    const anchorElementRect = anchorElem.getBoundingClientRect();

    // Guard: ensure valid rects with dimensions
    if (!rangeRect || anchorElementRect.width === 0) {
      hidePopup();
      return;
    }

    // Calculate threshold dynamically from sticky toolbar if present
    const stickyToolbar = anchorElem.parentElement?.querySelector('.toolbar.sticky-top');
    const toolbarRect = stickyToolbar?.getBoundingClientRect();
    const toolbarHeight = (toolbarRect?.height > 0) 
      ? toolbarRect.height + VERTICAL_GAP 
      : DEFAULT_TOOLBAR_HEIGHT;

    // Hide if selection is near the sticky toolbar
    if (rangeRect.top - anchorElementRect.top < toolbarHeight) {
      hidePopup();
      return;
    }

    const popupElemRect = popupElem.getBoundingClientRect();
    const popupHeight = popupElemRect.height || popupElem.offsetHeight;
    const popupWidth = popupElemRect.width || popupElem.offsetWidth;

    // Calculate position relative to the anchor element
    let top = rangeRect.top - anchorElementRect.top - popupHeight - VERTICAL_GAP;
    let left = rangeRect.left - anchorElementRect.left + (rangeRect.width - popupWidth) / 2;

    // Position below if would go above viewport
    if (rangeRect.top - popupHeight - VERTICAL_GAP < 0) {
      top = rangeRect.bottom - anchorElementRect.top + VERTICAL_GAP;
    }

    // Keep within horizontal bounds
    left = Math.max(HORIZONTAL_OFFSET, Math.min(left, anchorElementRect.width - popupWidth - HORIZONTAL_OFFSET));

    popupElem.style.opacity = '1';
    popupElem.style.top = `${top}px`;
    popupElem.style.left = `${left}px`;
  }, [editor, anchorElem]);

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        $updateTextFormatFloatingToolbar();
      });
    };

    window.addEventListener('resize', update);
    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', update);
    }

    return () => {
      window.removeEventListener('resize', update);
      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', update);
      }
    };
  }, [editor, $updateTextFormatFloatingToolbar, anchorElem]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateTextFormatFloatingToolbar();
    });
  }, [editor, $updateTextFormatFloatingToolbar]);

  const handleFormat = (command, payload = null) => {
    return (event) => {
      event.preventDefault();
      event.stopPropagation();
      editor.dispatchCommand(command, payload);
    };
  };

  const handleInsertLink = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsModalOpen(true);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <div ref={popupRef} className="toolbar floating-toolbar">
        <button
          onClick={handleFormat(FORMAT_TEXT_COMMAND, 'bold')}
          className={`toolbar-item ${isBold ? 'active' : ''}`}
          aria-label="Bold"
          type="button"
        >
          <Icon imgSrc="bold" />
        </button>
        <button
          onClick={handleFormat(FORMAT_TEXT_COMMAND, 'italic')}
          className={`toolbar-item ${isItalic ? 'active' : ''}`}
          aria-label="Italic"
          type="button"
        >
          <Icon imgSrc="italic" />
        </button>
        <button
          onClick={handleFormat(FORMAT_TEXT_COMMAND, 'underline')}
          className={`toolbar-item ${isUnderline ? 'active' : ''}`}
          aria-label="Underline"
          type="button"
        >
          <Icon size="sd" imgSrc="underline" />
        </button>
        {!isLink ? (
          <button
            onClick={handleInsertLink}
            className="toolbar-item"
            aria-label="Insert link"
            type="button"
          >
            <Icon imgSrc="link" />
          </button>
        ) : (
          <button
            onClick={handleFormat(TOGGLE_LINK_COMMAND)}
            className="toolbar-item active"
            aria-label="Remove link"
            type="button"
          >
            <Icon imgSrc="unlink" />
          </button>
        )}
        <button
          onClick={handleFormat(isBulletList ? REMOVE_LIST_COMMAND : INSERT_UNORDERED_LIST_COMMAND)}
          className={`toolbar-item ${isBulletList ? 'active' : ''}`}
          aria-label="Bullet list"
          type="button"
        >
          <Icon size="sd" imgSrc="list" />
        </button>
        <button
          onClick={handleFormat(isNumberList ? REMOVE_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND)}
          className={`toolbar-item ${isNumberList ? 'active' : ''}`}
          aria-label="Numbered list"
          type="button"
        >
          <Icon size="sd" imgSrc="ordered-list" />
        </button>
        <button
          onClick={handleFormat(FORMAT_TEXT_COMMAND, 'strikethrough')}
          className={`toolbar-item ${isStrikethrough ? 'active' : ''}`}
          aria-label="Strikethrough"
          type="button"
        >
          <Icon size="sd" imgSrc="strikethrough" />
        </button>
        <button
          onClick={handleFormat(FORMAT_TEXT_COMMAND, 'highlight')}
          className={`toolbar-item ${isHighlight ? 'active' : ''}`}
          aria-label="Highlight"
          type="button"
        >
          <Icon size="sd" imgSrc="highlight" />
        </button>
      </div>
      {isModalOpen && (
        <BlocksmithModal
          toggle={toggleModal}
          isOpen={isModalOpen}
          modal={LinkModal}
        />
      )}
    </>
  );
}

function useFloatingTextFormatToolbar(editor) {
  const [isText, setIsText] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');

  const resetFormats = useCallback(() => {
    setIsText(false);
    setIsLink(false);
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
    setIsStrikethrough(false);
    setIsHighlight(false);
    setBlockType('paragraph');
  }, []);

  const updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();

      if (!$isRangeSelection(selection)) {
        resetFormats();
        return;
      }

      const node = $getSelectedNode(selection);
      const parent = node.getParent();
      const isTextSelected = !selection.isCollapsed() && selection.getTextContent().trim().length > 0;

      if (!isTextSelected) {
        resetFormats();
        return;
      }

      setIsText(true);

      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsHighlight(selection.hasFormat('highlight'));

      setIsLink($isLinkNode(parent) || $isLinkNode(node));

      const anchorNode = selection.anchor.getNode();
      let element = anchorNode.getKey() === 'root'
        ? anchorNode
        : $findMatchingParent(anchorNode, (e) => {
          const parent = e.getParent();
          return parent !== null && $isRootOrShadowRoot(parent);
        });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      let newBlockType = element.getType();

      if (elementDOM !== null && $isListNode(element)) {
        const parentList = $getNearestNodeOfType(anchorNode, ListNode);
        newBlockType = parentList ? parentList.getListType() : element.getListType();
      }

      setBlockType(newBlockType);
    });
  }, [editor, resetFormats]);

  useEffect(() => {
    document.addEventListener('selectionchange', updatePopup);
    return () => {
      document.removeEventListener('selectionchange', updatePopup);
    };
  }, [updatePopup]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updatePopup();
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updatePopup();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updatePopup]);

  return {
    isText,
    isLink,
    isBold,
    isItalic,
    isUnderline,
    isStrikethrough,
    isHighlight,
    blockType,
  };
}

/**
 * Based on Lexical's FloatingTextFormatToolbarPlugin
 * @see https://github.com/facebook/lexical/tree/0c9e1eb2c8f1fff0852fab3b6a351a0b44bc44cc/packages/lexical-playground/src/plugins/FloatingTextFormatToolbarPlugin
 */
export default function FloatingTextFormatToolbarPlugin({ anchorElem }) {
  const [editor] = useLexicalComposerContext();
  
  const {
    isText,
    isLink,
    isBold,
    isItalic,
    isUnderline,
    isStrikethrough,
    isHighlight,
    blockType,
  } = useFloatingTextFormatToolbar(editor);

  if (!editor.isEditable()) {
    return null;
  }

  return createPortal(
    isText && (
      <FloatingTextFormatToolbar
        editor={editor}
        anchorElem={anchorElem}
        isLink={isLink}
        isBold={isBold}
        isItalic={isItalic}
        isUnderline={isUnderline}
        isStrikethrough={isStrikethrough}
        isHighlight={isHighlight}
        blockType={blockType}
      />
    ),
    anchorElem
  );
}
