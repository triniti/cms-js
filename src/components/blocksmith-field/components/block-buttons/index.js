import SpecialCharacterButton from '@triniti/cms/components/blocksmith-field/components/special-character-button/index.js';
import classNames from 'classnames';
import CopyButton from '@triniti/cms/components/blocksmith-field/components/copy-block-button/index.js';
import DeleteButton from '@triniti/cms/components/blocksmith-field/components/delete-block-button/index.js';
import EditButton from '@triniti/cms/components/blocksmith-field/components/edit-block-button/index.js';
import PasteButton from '@triniti/cms/components/blocksmith-field/components/paste-block-button/index.js';
import React from 'react';
import ReorderButtons from '@triniti/cms/components/blocksmith-field/components/reorder-block-buttons/index.js';
import { blockTypes } from '@triniti/cms/components/blocksmith-field/constants.js';
import { getBlockForKey, isBlockEmpty } from '@triniti/cms/components/blocksmith-field/utils/index.js';

export default class BlockButtons extends React.Component {
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

  UNSAFE_componentWillReceiveProps({ resetFlag }) {
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
      showCopyButton = type === blockTypes.ATOMIC;
      showCharacterButton = type.match(/(unstyled|(un)?ordered-list-item)/);

      if (showCopyButton && copiedBlock) {
        const blockData = activeBlock.getData();
        if (
          blockData
          && blockData.get('canvasBlock')
          && blockData.get('canvasBlock').get('etag') === copiedBlock.get('etag')
        ) {
          copyText = 'Copied to clipboard!';
        }
      }
    }

    return (
      <div
        className={classNames('d-flex align-items-center', { 'is-first': isFirstBlock, 'is-last': isLastBlock })}
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
