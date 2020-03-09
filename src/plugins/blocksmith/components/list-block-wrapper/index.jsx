import React from 'react';
import { connect } from 'react-redux';
import { ContentBlock, EditorBlock } from 'draft-js';
import PropTypes from 'prop-types';
import { handleDragEnd, handleDragStart } from '../../utils';
import selector from './selector';

export const ListBlockWrapper = (props) => {
  const {
    block,
    blockProps,
    offsetKey,
    draggable,
  } = props;

  const { blockButtonComponent: BlockButtonComponent } = blockProps;

  return (
    <>
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
          {...props}
        />

        <BlockButtonComponent />
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
    </>
  );
};

ListBlockWrapper.propTypes = {
  block: PropTypes.instanceOf(ContentBlock).isRequired,
  blockProps: PropTypes.shape({
    isFirst: PropTypes.bool.isRequired,
    isLast: PropTypes.bool.isRequired,
    getReadOnly: PropTypes.func.isRequired,
    blockButtonComponent: PropTypes.func.isRequired,
  }).isRequired,
  draggable: PropTypes.bool,
  offsetKey: PropTypes.string.isRequired,
};

ListBlockWrapper.defaultProps = {
  draggable: true,
};

export default connect(selector)(ListBlockWrapper);
