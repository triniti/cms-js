import React, { useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { NodeEventPlugin } from '@lexical/react/LexicalNodeEventPlugin';
import { ParagraphNode } from 'lexical';
import InsertBlockButtons from '@triniti/cms/blocksmith/components/insert-block-buttons/index.js';
import BlocksmithNode from '@triniti/cms/blocksmith/nodes/BlocksmithNode.js';
import { INSERT_BLOCK_COMMAND } from '@triniti/cms/blocksmith/plugins/BlocksmithPlugin.js';
import { SHOW_BLOCK_SELECTOR_COMMAND } from '@triniti/cms/blocksmith/plugins/ToolbarPlugin.js';

const BUTTON_OFFSET = 80; // height of the toolbar plus the card header minus the padding between blocks

export default function InsertBlockPlugin() {
  const [editor] = useLexicalComposerContext();
  const [buttonsStyle, setButtonsStyle] = useState({ display: 'none' });
  const blocksmithEditor = document.querySelector('.blocksmith-editor');
  const [nodeKey, setNodeKey] = useState();

  const handleMouseEnterNode = (event, _editor, key) => {
    const nodeRect = event.target.getBoundingClientRect();
    const blocksmithRect = blocksmithEditor.getBoundingClientRect()
    const top = nodeRect.top + nodeRect.height + BUTTON_OFFSET - blocksmithRect.top;
    setButtonsStyle({ top: `${top}px` });
    setNodeKey(key);
  };

  const handleMouseEnterBlocksmithNode = (event, _editor, key) => {
    if (!event.target.dataset.lexicalDecorator) {
      return;
    }
    handleMouseEnterNode(event, _editor, key);
  };

  const handleInsertBlock = (event) => {
    event.preventDefault();
    event.stopPropagation();
    editor.dispatchCommand(SHOW_BLOCK_SELECTOR_COMMAND, nodeKey);
  };

  const handleInsertTextBlock = (event) => {
    event.preventDefault();
    event.stopPropagation();
    editor.dispatchCommand(INSERT_BLOCK_COMMAND, { afterNodeKey: nodeKey });
  };

  return (
    <>
      <NodeEventPlugin
        nodeType={ParagraphNode}
        eventType={'mouseenter'}
        eventListener={handleMouseEnterNode}
      />
      <NodeEventPlugin
        nodeType={BlocksmithNode}
        eventType={'mouseenter'}
        eventListener={handleMouseEnterBlocksmithNode}
      />
      <InsertBlockButtons
        onInsertBlock={handleInsertBlock}
        onInsertTextBlock={handleInsertTextBlock}
        style={buttonsStyle}
      />
    </>
  );
}
