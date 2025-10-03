import React, { useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { NodeEventPlugin } from '@lexical/react/LexicalNodeEventPlugin';
import { ParagraphNode } from 'lexical';
import InsertBlockButtons from '@triniti/cms/blocksmith/components/insert-block-buttons/index.js';
import { INSERT_BLOCK_COMMAND } from '@triniti/cms/blocksmith/plugins/BlocksmithPlugin.js';
import { SHOW_BLOCK_SELECTOR_COMMAND } from '@triniti/cms/blocksmith/plugins/ToolbarPlugin.js';

export default function InsertBlockPlugin() {
  const [editor] = useLexicalComposerContext();
  const [buttonsStyle, setButtonsStyle] = useState({ display: 'none' });
  const scrollContainer = document.querySelector('.screen-body');
  const [nodeKey, setNodeKey] = useState()

  const handleMouseEnter = (event, _editor, key) => {
    const paragraphRect = event.target.getBoundingClientRect();
    const scrollRect = scrollContainer.getBoundingClientRect();
    // offset by 37, which is the height of the buttons plus the size of the padding between paragraphs
    const top = paragraphRect.top + paragraphRect.height + scrollContainer.scrollTop - scrollRect.top - 37;
    setButtonsStyle({ top: `${top}px` });
    setNodeKey(key);
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
        eventListener={handleMouseEnter}
      />
      <InsertBlockButtons
        onInsertBlock={handleInsertBlock}
        onInsertTextBlock={handleInsertTextBlock}
        style={buttonsStyle}
      />
    </>
  );
}
