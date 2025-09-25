import React from 'react';
import { Button } from 'reactstrap';
import { Icon } from '@triniti/cms/components/index.js';

export default function InsertBlockButtons({ onInsertTextBlock, onInsertBlock, className = 'insert-block-buttons' }) {
  return (
    <div className={className}>
      <Button color="primary" className="rounded-pill" size="sm" onClick={onInsertTextBlock}>
        <Icon imgSrc="plus" alt="Insert Block" size="xs" className="me-1" />Text
      </Button>
      <Button color="primary" className="rounded-pill" size="sm" onClick={onInsertBlock}>
        <Icon imgSrc="plus" alt="Insert Block" size="xs" className="me-1" />Block
      </Button>
    </div>
  );
}
