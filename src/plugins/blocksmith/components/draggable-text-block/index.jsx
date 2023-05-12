import PlaceholderErrorBoundary from '@triniti/cms/plugins/blocksmith/components/placeholder-error-boundary';
import { ContentBlock, EditorBlock } from 'draft-js';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { handleDragEnd, handleDragStart } from '../../utils';
import selector from './selector';

// todo: incorporate the block buttons into this component and rename to TextBlockWrapper
export const DraggableTextBlock = ({ block, draggable, offsetKey, blockProps, ...rest }) => (
  <PlaceholderErrorBoundary block={block}>
    {draggable && (
    <div
      className="drag-area draggable-top"
      onMouseEnter={() => blockProps.setActiveBlockKey(block.getKey())}
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
      onMouseEnter={() => blockProps.setActiveBlockKey(block.getKey())}
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
      onMouseEnter={() => blockProps.setActiveBlockKey(block.getKey())}
      contentEditable={false}
      draggable
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart(block.getKey())}
    />
    )}
  </PlaceholderErrorBoundary>
);

DraggableTextBlock.propTypes = {
  block: PropTypes.instanceOf(ContentBlock).isRequired,
  draggable: PropTypes.bool.isRequired,
  offsetKey: PropTypes.string.isRequired,
};

export default connect(selector)(DraggableTextBlock);
