import { connect } from 'react-redux';
import { ContentBlock, EditorBlock } from 'draft-js';
import PropTypes from 'prop-types';
import React from 'react';
import { handleDragEnd, handleDragStart } from '../../utils';
import selector from './selector';

// todo: incorporate the block buttons into this component and rename to TextBlockWrapper
export const DraggableTextBlock = ({ block, draggable, offsetKey, ...rest }) => (
  <>
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
  </>
);

DraggableTextBlock.propTypes = {
  block: PropTypes.instanceOf(ContentBlock).isRequired,
  draggable: PropTypes.bool.isRequired,
  offsetKey: PropTypes.string.isRequired,
};

export default connect(selector)(DraggableTextBlock);
