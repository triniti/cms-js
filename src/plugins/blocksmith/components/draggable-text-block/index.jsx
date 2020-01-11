import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ContentBlock, EditorBlock } from 'draft-js';

import { handleDragEnd, handleDragStart } from '../../utils';
import selector from './selector';

// todo: incorporate the block buttons into this component and rename to TextBlockWrapper
export const DraggableTextBlock = ({ block, draggable, handleFocus, offsetKey, ...rest }) => {
  const [hovered, setHovered] = useState(false);
  const onMouseEnter = (e) => {
    e.preventDefault();
    if (hovered) {
      return;
    }
    handleFocus();
    setHovered(true);
  };
  return (
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
        onMouseEnter={onMouseEnter}
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
};

DraggableTextBlock.propTypes = {
  block: PropTypes.instanceOf(ContentBlock).isRequired,
  draggable: PropTypes.bool.isRequired,
  handleFocus: PropTypes.func.isRequired,
  offsetKey: PropTypes.string.isRequired,
};

export default connect(selector)(DraggableTextBlock);
