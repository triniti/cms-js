import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import resolveComponent from '@triniti/cms/blocksmith/utils/resolveComponent.js';
import BlocksmithModal from '@triniti/cms/blocksmith/components/blocksmith-modal/index.js';
import config from '@triniti/app/config/blocksmith.js';

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalComponent, setModalComponent] = useState();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCreateBlock = (event) => {
    event.preventDefault();
    const type = event.currentTarget.dataset.type;
    const curie = `${APP_VENDOR}:canvas:block:${type}`;
    const Component = resolveComponent(curie, 'modal');
    const Modal = () => (p) => <Component curie={curie} {...p} />;
    setModalComponent(Modal);
    setIsModalOpen(true);
  };

  const toolbarRef = useRef(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsHighlight(selection.hasFormat('highlight'));
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
  }, [editor, $updateToolbar]);

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
                <DropdownItem key={`${item.type}${index}`} onClick={handleCreateBlock} data-type={item.type}>
                  <i className={`icon ${item.type}`} />
                  <span className="text">{item.text}</span>
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
      <BlocksmithModal toggle={toggleModal} isOpen={isModalOpen} modal={modalComponent} />
    </>
  );
}
