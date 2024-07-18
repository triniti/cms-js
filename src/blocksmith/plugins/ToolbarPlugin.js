import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  createCommand,
  COMMAND_PRIORITY_EDITOR,
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
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { Icon } from '@triniti/cms/components/index.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import resolveComponent from '@triniti/cms/blocksmith/utils/resolveComponent.js';
import BlocksmithModal from '@triniti/cms/blocksmith/components/blocksmith-modal/index.js';
import BlockSelectorModal from '@triniti/cms/blocksmith/components/block-selector-modal/index.js';
import LinkModal from '@triniti/cms/blocksmith/components/link-modal/index.js';
import getSelectedNode from '@triniti/cms/blocksmith/utils/getSelectedNode.js';
import { INSERT_BLOCK_COMMAND } from '@triniti/cms/blocksmith/plugins/BlocksmithPlugin.js';
import config from '@triniti/cms/blocksmith/config.js';

export const SHOW_BLOCK_SELECTOR_COMMAND = createCommand();

export default function ToolbarPlugin() {
  const policy = usePolicy();
  const [editor] = useLexicalComposerContext();
  const [refreshed, setRefreshed] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef();
  const toolbarRef = useRef(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [blockType, setBlockType] = useState('paragraph');
  const isBulletList = blockType === 'bullet';
  const isNumberList = blockType === 'number';

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleInsertBlock = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const type = event.currentTarget.dataset.type;
    const afterNodeKey = event.currentTarget.dataset.afterNodeKey;

    if (type === 'text-block') {
      editor.dispatchCommand(INSERT_BLOCK_COMMAND, { afterNodeKey });
      modalRef.current = null;
      setIsModalOpen(false);
      return;
    }

    const curie = `${APP_VENDOR}:canvas:block:${type}`;
    const Component = resolveComponent(curie, 'modal');
    modalRef.current = (p) => <Component curie={curie} afterNodeKey={afterNodeKey} canCreate {...p} />;
    setIsModalOpen(true);
    setRefreshed(refreshed + 1); // merely forces reload of this component
  };

  const handleShowBlockSelector = (nodeKey) => {
    modalRef.current = (p) => <BlockSelectorModal afterNodeKey={nodeKey} {...p} />;
    setIsModalOpen(true);
  };

  const handleInsertLink = (event) => {
    event.preventDefault();
    event.stopPropagation();
    modalRef.current = LinkModal;
    setIsModalOpen(true);
  };

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
      setBlockType('paragraph');
      return;
    }

    setIsBold(selection.hasFormat('bold'));
    setIsItalic(selection.hasFormat('italic'));
    setIsUnderline(selection.hasFormat('underline'));
    setIsStrikethrough(selection.hasFormat('strikethrough'));
    // todo: fix highlight
    setIsHighlight(selection.hasFormat('highlight'));

    const $node = getSelectedNode(selection);
    const $parent = $node.getParent();
    if ($isLinkNode($parent)) {
      setIsLink(true);
      setSelectedLink($parent.exportJSON());
    } else if ($isLinkNode($node)) {
      setIsLink(true);
      setSelectedLink($node.exportJSON());
    } else {
      setIsLink(false);
      setSelectedLink(null);
    }

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
      editor.registerCommand(SHOW_BLOCK_SELECTOR_COMMAND, (nodeKey) => {
        handleShowBlockSelector(nodeKey);
        return true;
      }, COMMAND_PRIORITY_EDITOR),
    );
  }, [editor, $updateToolbar, isModalOpen]);

  // we don't want buttons submitting the main form
  const createHandler = (command, payload = null) => {
    return (event) => {
      event.preventDefault();
      event.stopPropagation();
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
          className={`toolbar-item ${isBold ? 'active' : ''}`}
        >
          <Icon imgSrc="bold" />
        </button>
        <button
          onClick={createHandler(FORMAT_TEXT_COMMAND, 'italic')}
          className={`toolbar-item ${isItalic ? 'active' : ''}`}
        >
          <Icon imgSrc="italic" />
        </button>
        <button
          onClick={createHandler(FORMAT_TEXT_COMMAND, 'underline')}
          className={`toolbar-item ${isUnderline ? 'active' : ''}`}
        >
          <Icon size="sd" imgSrc="underline" />
        </button>
        <button
          onClick={createHandler(FORMAT_TEXT_COMMAND, 'strikethrough')}
          className={`toolbar-item ${isStrikethrough ? 'active' : ''}`}
        >
          <Icon size="sd" imgSrc="strikethrough" />
        </button>
        {/*
        this is broken in lexical atm
        https://github.com/facebook/lexical/issues/4641
        once fixed we'll re-enable
        <button
          onClick={createHandler(FORMAT_TEXT_COMMAND, 'highlight')}
          className={`toolbar-item ${isHighlight ? 'active' : ''}`}
        >
          <Icon size="sd" imgSrc="highlight" />
        </button>
        */}
        <button
          onClick={createHandler(isNumberList ? REMOVE_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND)}
          className={`toolbar-item ${isNumberList ? 'active' : ''}`}
        >
          <Icon size="sd" imgSrc="ordered-list" />
        </button>
        <button
          onClick={createHandler(isBulletList ? REMOVE_LIST_COMMAND : INSERT_UNORDERED_LIST_COMMAND)}
          className={`toolbar-item ${isBulletList ? 'active' : ''}`}
        >
          <Icon size="sd" imgSrc="list" />
        </button>
        {!isLink && (
          <>
            <button onClick={handleInsertLink} className="toolbar-item">
              <Icon imgSrc="link" />
            </button>
          </>
        )}
        {isLink && (
          <>
            <button onClick={handleInsertLink} className="toolbar-item active">
              <Icon imgSrc="link" />
            </button>
            <button onClick={createHandler(TOGGLE_LINK_COMMAND)} className="toolbar-item active">
              <Icon imgSrc="unlink" />
            </button>
          </>
        )}

        <div className="divider-vertical mx-1" />
        <UncontrolledDropdown>
          <DropdownToggle className="mb-0 btn-sm toolbar-item shadow-none" color="light">
            <Icon size="sm" imgSrc="plus-outline" className="me-2" />Insert Block
          </DropdownToggle>
          <DropdownMenu className="rounded-3">
            {config.toolbar.blocks.map((type, index) => {
              if (type === 'separator') {
                return (
                  <div key={`${type}${index}`} tabIndex="-1" className="dropdown-divider"></div>
                );
              }

              if (!policy.isGranted(`blocksmith:${type}:create`)) {
                return null;
              }

              const icon = config.blocks[type]?.icon || type;
              const title = config.blocks[type]?.title || type;

              return (
                <DropdownItem key={`${type}${index}`} onClick={handleInsertBlock} data-type={type}>
                  <Icon imgSrc={icon} className="me-2" size="sd" />
                  <span className="text">{title}</span>
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </UncontrolledDropdown>
        <UncontrolledDropdown>
          <DropdownToggle className="mb-0 btn-sm toolbar-item shadow-none" color="light">
            <Icon size="sm" imgSrc="plus-outline" className="me-2" /> Embed Social
          </DropdownToggle>
          <DropdownMenu className="rounded-3">
            {config.toolbar.externalBlocks.map((type, index) => {
              if (type === 'separator') {
                return (
                  <div key={`${type}${index}`} tabIndex="-1" className="dropdown-divider"></div>
                );
              }

              if (!policy.isGranted(`blocksmith:${type}:create`)) {
                return null;
              }

              const icon = config.blocks[type]?.icon || type;
              const title = config.blocks[type]?.title || type;

              return (
                <DropdownItem key={`${type}${index}`} onClick={handleInsertBlock} data-type={type}>
                  <Icon imgSrc={icon} className="me-2" />
                  <span className="text">{title}</span>
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
      <BlocksmithModal
        toggle={toggleModal}
        isOpen={isModalOpen}
        modal={modalRef.current}
        selectedLink={selectedLink}
        onInsertBlock={handleInsertBlock}
      />
    </>
  );
}
