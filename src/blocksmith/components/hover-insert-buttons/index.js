import React, { useState, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_BLOCK_AT_TOP_COMMAND } from '@triniti/cms/blocksmith/plugins/BlocksmithPlugin.js';
import { SHOW_BLOCK_SELECTOR_AT_TOP_COMMAND } from '@triniti/cms/blocksmith/plugins/ToolbarPlugin.js';
import InsertBlockButtons from '@triniti/cms/blocksmith/components/insert-block-buttons/index.js';
import './styles.scss';

export default function HoverInsertButtons({ isDragging }) {
  const [editor] = useLexicalComposerContext();
  const [isHovered, setIsHovered] = useState(false);

  // pointer must be able to pass through while dragging so that blocks can be placed at the top
  const pointerEvents = isDragging ? 'none' : 'all';

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleInsertTextBlock = (event) => {
    event.preventDefault();
    event.stopPropagation();
    editor.dispatchCommand(INSERT_BLOCK_AT_TOP_COMMAND, {});
  };

  const handleInsertBlock = (event) => {
    event.preventDefault();
    event.stopPropagation();
    editor.dispatchCommand(SHOW_BLOCK_SELECTOR_AT_TOP_COMMAND, {});
  };

  return (
    <div 
      className="hover-insert-buttons-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleInsertTextBlock}
      style={{ pointerEvents }}
    >
      <InsertBlockButtons
        className={`hover-insert-buttons ${isHovered ? 'visible' : ''}`}
        onInsertTextBlock={handleInsertTextBlock}
        onInsertBlock={handleInsertBlock}
      />
    </div>
  );
}