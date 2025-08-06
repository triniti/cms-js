import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Icon } from '@triniti/cms/components/index.js';
import { INSERT_BLOCK_AT_TOP_COMMAND } from '@triniti/cms/blocksmith/plugins/BlocksmithPlugin.js';
import { SHOW_BLOCK_SELECTOR_AT_TOP_COMMAND } from '@triniti/cms/blocksmith/plugins/ToolbarPlugin.js';
import './styles.scss';

export default function HoverInsertButtons() {
  const [editor] = useLexicalComposerContext();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    
    const container = document.querySelector('.blocksmith-editor-container');
    if (container) {
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

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
    <div className={`hover-insert-buttons ${isHovered ? 'visible' : ''}`}>
      <Button color="primary" className="rounded-pill" size="sm" onClick={handleInsertTextBlock}>
        <Icon imgSrc="plus" alt="Insert Block" size="xs" className="me-1" />Text
      </Button>
      <Button color="primary" className="rounded-pill" size="sm" onClick={handleInsertBlock}>
        <Icon imgSrc="plus" alt="Insert Block" size="xs" className="me-1" />Block
      </Button>
    </div>
  );
}