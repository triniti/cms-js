import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ContentBlock, EditorBlock } from 'draft-js';

import { handleDragEnd, handleDragStart } from '../../utils';
import selector from './selector';

export const TextBlockWrapper = (props) => {
  const {
    block,
    blockProps,
    offsetKey,
    draggable,
    config
  } = props;

  const {
    blockButtonComponent: BlockButtonComponent,
  } = blockProps;

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
        style={{ cursor: 'text', width: 'calc(100% - 150px)'}}
        role="presentation"
      >
        <EditorBlock
          block={block}
          offsetKey={offsetKey}
          {...props}
        />

        <BlockButtonComponent />
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

TextBlockWrapper.propTypes = {
  block: PropTypes.instanceOf(ContentBlock).isRequired,
  blockProps: PropTypes.shape({
    getReadOnly: PropTypes.func.isRequired,
    blockButtonComponent: PropTypes.func.isRequired,
  }).isRequired,
  draggable: PropTypes.bool.isRequired,
  offsetKey: PropTypes.string.isRequired,
};

export default connect(selector)(TextBlockWrapper);
