import React from 'react';
import { connect } from 'react-redux';
import { EditorBlock } from 'draft-js';
import PlaceholderErrorBoundary from 'components/blocksmith-field/components/placeholder-error-boundary';
import { handleDragEnd, handleDragStart } from 'components/blocksmith-field/utils';
import selector from 'components/blocksmith-field/components/list-block-wrapper/selector';

function ListBlockWrapper({ block, blockProps, draggable, offsetKey, ...rest }) {
  return (
    <PlaceholderErrorBoundary block={block}>
      {draggable && blockProps.isFirst && (
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
      >
        <EditorBlock
          block={block}
          offsetKey={offsetKey}
          {...rest}
        />
      </span>
      {draggable && blockProps.isLast && (
        <div
          className="drag-area draggable-bottom"
          contentEditable={false}
          draggable
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart(block.getKey())}
        />
      )}
    </PlaceholderErrorBoundary>
  )
}

export default connect(selector)(ListBlockWrapper);
