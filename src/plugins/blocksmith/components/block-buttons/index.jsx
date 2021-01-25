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
import { blockTypes } from '../../constants';
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

    throw new Error();
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
