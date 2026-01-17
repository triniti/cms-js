import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { Icon } from '@triniti/cms/components/index.js';
import { INSERT_BLOCK_COMMAND } from '@triniti/cms/blocksmith/plugins/BlocksmithPlugin.js';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export default function BottomInsertBlockPlugin () {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="bottom-insert-block-button">
      <Button color="primary" className="rounded-pill" size="sm" onClick={() => editor.dispatchCommand(INSERT_BLOCK_COMMAND, {})}>
        <Icon imgSrc="plus" alt="Insert Block" size="xs" className="me-1" />Text
      </Button>
    </div>
  );
}