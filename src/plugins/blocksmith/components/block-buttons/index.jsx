import { EditorState } from 'draft-js';
import SpecialCharacterButton from '@triniti/cms/plugins/blocksmith/components/special-character-button';
import classNames from 'classnames';
import CopyButton from '@triniti/cms/plugins/blocksmith/components/copy-block-button';
import DeleteButton from '@triniti/cms/plugins/blocksmith/components/delete-block-button';
import EditButton from '@triniti/cms/plugins/blocksmith/components/edit-block-button';
import Message from '@gdbots/pbj/Message';
import PasteButton from '@triniti/cms/plugins/blocksmith/components/paste-block-button';
import PropTypes from 'prop-types';
import React from 'react';
import ReorderButtons from '@triniti/cms/plugins/blocksmith/components/reorder-block-buttons';
import { getBlockForKey, isBlockEmpty } from '../../utils';

export default class BlockButtons extends React.Component {
  static propTypes = {
    activeBlockKey: PropTypes.string,
    copiedBlock: PropTypes.instanceOf(Message),
    editorState: PropTypes.instanceOf(EditorState).isRequired,
    onCopyBlock: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onPasteBlock: PropTypes.func.isRequired,
    onShiftBlock: PropTypes.func.isRequired,
    onToggleSpecialCharacterModal: PropTypes.func.isRequired,
    resetFlag: PropTypes.number,
  };

  static defaultProps = {
    activeBlockKey: '',
    copiedBlock: null,
    resetFlag: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      areShiftButtonsVisible: false,
      resetFlag: props.resetFlag,
      timeoutId: null,
    };

    this.handleHideShiftButtons = this.handleHideShiftButtons.bind(this);
    this.handleShiftBlock = this.handleShiftBlock.bind(this);
    this.handleShowShiftButtons = this.handleShowShiftButtons.bind(this);
  }

  // need this here to avoid memory leak error.
  componentWillUnmount() {
    const { timeoutId } = this.state;
    clearTimeout(timeoutId);
  }

  componentWillReceiveProps({ resetFlag }) {
    if (this.state.resetFlag !== resetFlag) { // eslint-disable-line react/destructuring-assignment
      const { timeoutId } = this.state;
      clearTimeout(timeoutId);
      this.setState({
        areShiftButtonsVisible: false,
        resetFlag,
        timeoutId: null,
      });
    }
  }

  handleHideShiftButtons(delay = 1000) {
    const { timeoutId } = this.state;
    if (!timeoutId) {
      this.setState({
        timeoutId: setTimeout((t) => {
          t.setState({
            areShiftButtonsVisible: false,
          });
        }, delay, this),
      });
    }
  }

  handleShiftBlock(direction) {
    const { activeBlockKey, editorState, onShiftBlock } = this.props;
    const { timeoutId } = this.state;
    onShiftBlock(
      getBlockForKey(editorState.getCurrentContent(), activeBlockKey),
      direction,
    );
    clearTimeout(timeoutId);
    this.setState({
      areShiftButtonsVisible: false,
      timeoutId: null,
    });
  }

  handleShowShiftButtons() {
    const { timeoutId } = this.state;
    clearTimeout(timeoutId);
    this.setState({
      areShiftButtonsVisible: true,
      timeoutId: null,
    });
  }

  render() {
    const { areShiftButtonsVisible } = this.state;
    const {
      activeBlockKey,
      copiedBlock,
      editorState,
      onHandleDraggableBlocks: handleDraggableBlocks,
      onCopyBlock: handleCopyBlock,
      onDelete: handleDelete,
      onEdit: handleEdit,
      onPasteBlock: handlePasteBlock,
      onToggleSpecialCharacterModal: handleToggleSpecialCharacterModal,
    } = this.props;

    if (!activeBlockKey) {
      return null;
    }

    const contentState = editorState.getCurrentContent();
    const isFirstBlock = contentState.getFirstBlock().getKey() === activeBlockKey;
    const isLastBlock = contentState.getLastBlock().getKey() === activeBlockKey;
    const activeBlock = getBlockForKey(contentState, activeBlockKey);

    let isEmpty = true;
    let showCopyButton = false;
    let showCharacterButton = false;
    let copyText = 'Copy';
    if (activeBlock) {
      const type = activeBlock.getType();
      isEmpty = isBlockEmpty(activeBlock);
      showCopyButton = type === 'atomic';
      showCharacterButton = type.match(/(unstyled|(un)?ordered-list-item)/);

      if (showCopyButton && copiedBlock) {
        const entityKey = activeBlock.getEntityAt(0);
        const entity = entityKey && contentState.getEntity(entityKey);

        if (entity) {
          const canvasBlock = entity.getData().block;
          if (canvasBlock.get('etag') === copiedBlock.get('etag')) {
            copyText = 'Copied to clipboard!';
          }
        }
      }
    }
    
    return (
      <div
        className={classNames('d-flex align-items-center block-buttons-holder', { 'is-first': isFirstBlock, 'is-last': isLastBlock })}
      >
        {isEmpty && copiedBlock && <PasteButton onPasteBlock={handlePasteBlock} />}
        {!isEmpty && (
          <>
            {showCharacterButton && (
              <SpecialCharacterButton
                onToggleSpecialCharacterModal={handleToggleSpecialCharacterModal}
              />
            )}
            {showCopyButton && <CopyButton onCopyBlock={handleCopyBlock} buttonText={copyText} />}
            <EditButton onEdit={handleEdit} />
            <ReorderButtons
              activeBlockKey={activeBlockKey}
              areShiftButtonsVisible={areShiftButtonsVisible}
              isFirstBlock={isFirstBlock}
              isLastBlock={isLastBlock}
              onHandleDraggableBlocks={handleDraggableBlocks}
              onHideShiftButtons={this.handleHideShiftButtons}
              onShiftBlock={this.handleShiftBlock}
              onShowShiftButtons={this.handleShowShiftButtons}
            />
            <DeleteButton activeBlock={activeBlock} onDelete={handleDelete} />
          </>
        )}
      </div>
    );
  }
}
