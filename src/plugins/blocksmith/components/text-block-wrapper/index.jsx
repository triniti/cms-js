import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';
import { ContentBlock, EditorBlock, EditorState } from 'draft-js';
import BlockButtons from '@triniti/cms/plugins/blocksmith/components/block-buttons';
import { handleDragEnd, handleDragStart } from '../../utils';
import selector from './selector';

export class TextBlockWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = { isHidden: true };
    this.toggleIsHidden = this.toggleIsHidden.bind(this);
  }

  toggleIsHidden() {
    const { isHidden } = this.state;
    this.setState({
      isHidden: !isHidden,
    });
  }

  render() {
    const { isHidden } = this.state;
    const {
      blockProps,
      block,
      draggable,
      offsetKey,
      ...rest
    } = this.props;

    if (!blockProps) {
      return null;
    }

    const {
      activeBlockKey,
      copiedBlock,
      editorState,
      handleCopyBlock,
      handleDelete,
      handleEdit,
      handlePasteBlock,
      handleShiftBlock,
      handleToggleSpecialCharacterModal,
    } = blockProps;

    return (
      <div
        onMouseEnter={this.toggleIsHidden}
        onMouseLeave={this.toggleIsHidden}
      >
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

          {!isHidden && (
          <BlockButtons
            isHidden={isHidden}
            activeBlockKey={activeBlockKey}
            copiedBlock={copiedBlock}
            editorState={editorState}
            onCopyBlock={handleCopyBlock}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onPasteBlock={handlePasteBlock}
            onShiftBlock={handleShiftBlock}
            onToggleSpecialCharacterModal={handleToggleSpecialCharacterModal}
            resetFlag={0}
          />
          )}
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
    );
  }
}

TextBlockWrapper.propTypes = {
  block: PropTypes.instanceOf(ContentBlock).isRequired,
  blockProps: PropTypes.shape({
    activeBlockKey: PropTypes.string.isRequired,
    copiedBlock: PropTypes.instanceOf(Message),
    editorState: PropTypes.instanceOf(EditorState),
    handleCopyBlock: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handlePasteBlock: PropTypes.func.isRequired,
    handleShiftBlock: PropTypes.func.isRequired,
    handleToggleSpecialCharacterModal: PropTypes.func.isRequired,
  }).isRequired,
  draggable: PropTypes.bool.isRequired,
  offsetKey: PropTypes.string.isRequired,
};

export default connect(selector)(TextBlockWrapper);
