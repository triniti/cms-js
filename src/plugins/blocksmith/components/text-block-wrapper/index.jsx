import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ContentBlock, EditorBlock } from 'draft-js';
import BlockButtons from '@triniti/cms/plugins/blocksmith/components/block-buttons';
import { handleDragEnd, handleDragStart } from '../../utils';
import selector from './selector';

export class TextBlockWrapper extends React.Component {
  constructor(props) {
    super(props);

    const {
      block,
      draggable,
      offsetKey,
    } = props;

    this.state = {
      hover: false,
      block,
      draggable,
      offsetKey,
    };

    this.handlerOnMouseEnter = this.handlerOnMouseEnter.bind(this);
    this.handlerOnMouseLeave = this.handlerOnMouseLeave.bind(this);
  }

  handlerOnMouseEnter() {
    const { hover } = this.state;
    this.setState({ hover: !hover });
  }

  handlerOnMouseLeave() {
    const { hover } = this.state;
    this.setState({ hover: !hover });
  }

  render() {
    const {
      hover,
      block,
      draggable,
      offsetKey,
    } = this.state;

    const {
      blockProps,
      ...rest
    } = this.props;

    const {
      getCopiedBlock,
      getEditorState,
      handleCopyBlock,
      handleDelete,
      handleEdit,
      handlePasteBlock,
      handleShiftBlock,
      handleToggleSpecialCharacterModal,
    } = blockProps || {};

    return (
      <div
        onMouseEnter={this.handlerOnMouseEnter}
        onMouseLeave={this.handlerOnMouseLeave}
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
            blockRendererFn={block}
            {...rest}
          />

          {hover && (
            <BlockButtons
              activeBlockKey={block.getKey()}
              copiedBlock={getCopiedBlock()}
              editorState={getEditorState()}
              onCopyBlock={() => handleCopyBlock(block.getKey())}
              onDelete={() => handleDelete(block.getKey())}
              onEdit={() => handleEdit(block.getKey())}
              onPasteBlock={() => handlePasteBlock()}
              onShiftBlock={() => handleShiftBlock()}
              onToggleSpecialCharacterModal={() => handleToggleSpecialCharacterModal()}
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
  draggable: PropTypes.bool.isRequired,
  offsetKey: PropTypes.string.isRequired,
  blockProps: PropTypes.shape({
    getEditorState: PropTypes.func.isRequired,
    getCopiedBlock: PropTypes.func.isRequired,
    handleCopyBlock: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handlePasteBlock: PropTypes.func.isRequired,
    handleShiftBlock: PropTypes.func.isRequired,
    handleToggleSpecialCharacterModal: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(selector)(TextBlockWrapper);
