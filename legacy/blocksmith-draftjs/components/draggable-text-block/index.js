import React from 'react';
import { connect } from 'react-redux';
import { EditorBlock } from 'draft-js';
import { handleDragEnd, handleDragStart } from '@triniti/cms/blocksmith/utils/index.js';
import PlaceholderErrorBoundary from '@triniti/cms/blocksmith/components/placeholder-error-boundary/index.js';
import selector from '@triniti/cms/blocksmith/components/draggable-text-block/selector.js';

// todo: incorporate the block buttons (and maybe sidebar/s) into this component and rename to TextBlockWrapper
function DraggableTextBlock({ block, blockProps, draggable, offsetKey, ...rest }) {
  const { onMouseEnter } = blockProps;
  return (
    <PlaceholderErrorBoundary block={block}>
      <div onMouseEnter={() => onMouseEnter(block.getKey())}>
        {draggable && (
        <div
          className="drag-area draggable-top"
          contentEditable={false}
          draggable
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart(block.getKey())}
        />
        )}
        <span
          data-offset-key={offsetKey}
          style={{ cursor: 'text' }}
          role="presentation"
        >
          <EditorBlock
            block={block}
            offsetKey={offsetKey}
            {...rest}
          />
        </span>
        {draggable && (
        <div
          className="drag-area draggable-bottom"
          contentEditable={false}
          draggable
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart(block.getKey())}
        />
        )}
      </div>
    </PlaceholderErrorBoundary>
  )
}

export default connect(selector)(DraggableTextBlock);
