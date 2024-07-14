import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
} from '@lexical/list';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import resolveComponent from '@triniti/cms/blocksmith/utils/resolveComponent.js';
import BlocksmithModal from '@triniti/cms/blocksmith/components/blocksmith-modal/index.js';
import LinkModal from '@triniti/cms/blocksmith/components/link-modal/index.js';
import getSelectedNode from '@triniti/cms/blocksmith/utils/getSelectedNode.js';
import config from '@triniti/app/config/blocksmith.js';

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const modalComponentRef = useRef();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleInsertBlock = (event) => {
    event.preventDefault();
    const type = event.currentTarget.dataset.type;
    const curie = `${APP_VENDOR}:canvas:block:${type}`;
    const Component = resolveComponent(curie, 'modal');
    modalComponentRef.current = (p) => <Component curie={curie} {...p} />;
    setIsModalOpen(true);
  };

  const handleInsertLink = (event) => {
    event.preventDefault();
    modalComponentRef.current = LinkModal;
    setIsModalOpen(true);
  };

  const toolbarRef = useRef(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      setIsBold(false);
      setIsItalic(false);
      setIsUnderline(false);
      setIsStrikethrough(false);
      setIsHighlight(false);
      setIsLink(false);
      setSelectedLink(null);
      return;
    }

    setIsBold(selection.hasFormat('bold'));
    setIsItalic(selection.hasFormat('italic'));
    setIsUnderline(selection.hasFormat('underline'));
    setIsStrikethrough(selection.hasFormat('strikethrough'));
    // todo: fix highlight
    setIsHighlight(selection.hasFormat('highlight'));

    const node = getSelectedNode(selection);
    const parent = node.getParent();
    if ($isLinkNode(parent)) {
      setIsLink(true);
      setSelectedLink(parent.exportJSON());
    } else if ($isLinkNode(node)) {
      setIsLink(true);
      setSelectedLink(node.exportJSON());
    } else {
      setIsLink(false);
      setSelectedLink(null);
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, $updateToolbar, isModalOpen]);

  // we don't want buttons submitting the main form
  const createHandler = (command, payload) => {
    return (event) => {
      event.preventDefault();
      editor.dispatchCommand(command, payload);
    };
  };

  if (!editor.isEditable()) {
    return null;
  }

  return (
    <>
      <div className="toolbar sticky-top" ref={toolbarRef}>
        <button
          onClick={createHandler(FORMAT_TEXT_COMMAND, 'bold')}
          className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
          aria-label="Format Bold">
          <i className="format bold" />
        </button>
        <button
          onClick={createHandler(FORMAT_TEXT_COMMAND, 'italic')}
          className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
          aria-label="Format Italics">
          <i className="format italic" />
        </button>
        <button
          onClick={createHandler(FORMAT_TEXT_COMMAND, 'underline')}
          className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
          aria-label="Format Underline">
          <i className="format underline" />
        </button>
        <button
          onClick={createHandler(FORMAT_TEXT_COMMAND, 'strikethrough')}
          className={'toolbar-item spaced ' + (isStrikethrough ? 'active' : '')}
          aria-label="Format Strikethrough">
          <i className="format strikethrough" />
        </button>
        <button
          onClick={createHandler(FORMAT_TEXT_COMMAND, 'highlight')}
          className={'toolbar-item spaced ' + (isHighlight ? 'active' : '')}
          aria-label="Format Highlight">
          <i className="format highlight" />
        </button>
        {!isLink && (
          <button
            onClick={handleInsertLink}
            className="toolbar-item spaced"
            aria-label="Insert link">
            <i className="format link" />
          </button>
        )}
        {isLink && (
          <>
            <button
              onClick={handleInsertLink}
              className="toolbar-item spaced active"
              aria-label="Edit link">
              <i className="format unlink" />
            </button>
            <button
              onClick={createHandler(TOGGLE_LINK_COMMAND, null)}
              className="toolbar-item spaced active"
              aria-label="Remove link">
              <i className="format unlink" />
            </button>
          </>
        )}

        <div className="divider" />
        <UncontrolledDropdown>
          <DropdownToggle>
            Insert Block
          </DropdownToggle>
          <DropdownMenu>
            {config.toolbar.blocks.map((item, index) => {
              if (item === 'separator') {
                return (
                  <hr key={`${item}${index}`} />
                );
              }

              return (
                <DropdownItem key={`${item.type}${index}`} onClick={handleInsertBlock} data-type={item.type}>
                  <i className={`icon ${item.type}`} />
                  <span className="text">{item.text}</span>
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
      <BlocksmithModal
        toggle={toggleModal}
        isOpen={isModalOpen}
        modal={modalComponentRef.current}
        selectedLink={selectedLink}
      />
    </>
  );
}
