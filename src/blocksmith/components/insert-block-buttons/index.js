import React from 'react';
import { Button } from 'reactstrap';
import { Icon } from '@triniti/cms/components/index.js';

export default function InsertBlockButtons({ onInsertTextBlock: handleInsertTextBlock , onInsertBlock: handleInsertBlock, className = 'insert-block-buttons', style = {} }) {
  return (
    <div className={className} onClick={handleInsertTextBlock} style={style}>
      <Button color="primary" className="rounded-pill" size="sm" onClick={handleInsertTextBlock}>
        <Icon imgSrc="plus" alt="Insert Block" size="xs" className="me-1" />Text
      </Button>
      <Button color="primary" className="rounded-pill" size="sm" onClick={handleInsertBlock}>
        <Icon imgSrc="plus" alt="Insert Block" size="xs" className="me-1" />Block
      </Button>
    </div>
  );
}
