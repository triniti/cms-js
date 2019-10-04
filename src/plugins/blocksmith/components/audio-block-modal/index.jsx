import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import AudioAssetsTable from '@triniti/cms/plugins/dam/components/audio-assets-table';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import {
  Modal,
  ModalBody,
  ScrollableContainer,
  Spinner,
} from '@triniti/admin-ui-plugin/components';

import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';
import CustomizeOptions from './CustomizeOptions';
import Footer from './Footer';
import Header from './Header';
import NotFoundMessage from './NotFoundMessage';
import SearchBar from '../search-bar';
import delegateFactory from './delegate';
import selector from './selector';
import { ALLOWED_MIME_TYPES } from './constants';

class AudioBlockModal extends React.Component {
  static propTypes = {
    audioAssetNodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
    audioAssetSort: PropTypes.string.isRequired,
    audioNode: PropTypes.instanceOf(Message),
    block: PropTypes.instanceOf(Message).isRequired,
    delegate: PropTypes.shape({
      handleClearAudioAssetChannel: PropTypes.func.isRequired,
      handleSearchAudioAssets: PropTypes.func.isRequired,
    }).isRequired,
    imageNode: PropTypes.instanceOf(Message),
    isAudioAssetSearchFulfilled: PropTypes.bool.isRequired,
    isFreshBlock: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool,
    node: PropTypes.instanceOf(Message).isRequired,
    onAddBlock: PropTypes.func.isRequired,
    onEditBlock: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
  };

  static defaultProps = {
    audioNode: null,
    imageNode: null,
    isOpen: false,
  };

  constructor(props) {
    super(props);
    const { block, imageNode, audioNode } = props;
    this.state = {
      activeStep: 0,
      q: '',
      hasUpdatedDate: block.has('updated_date'),
      isAssetPickerModalOpen: false,
      isReadyToDisplay: false,
      isUploaderOpen: false,
      launchText: block.get('launch_text') || '',
      selectedAudioNode: audioNode || null,
      selectedImageNode: imageNode || null,
      updatedDate: block.has('updated_date') ? moment(block.get('updated_date')) : moment(),
      aside: block.get('aside'),
    };
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeHasUpdatedDate = this.handleChangeHasUpdatedDate.bind(this);
    this.handleChangeLaunchText = this.handleChangeLaunchText.bind(this);
    this.handleChangeQ = this.handleChangeQ.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleClearImage = this.handleClearImage.bind(this);
    this.handleDecrementStep = this.handleDecrementStep.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
    this.handleIncrementStep = this.handleIncrementStep.bind(this);
    this.handleSearchAudioAssets = this.handleSearchAudioAssets.bind(this);
    this.handleSelectAudio = this.handleSelectAudio.bind(this);
    this.handleSelectImage = this.handleSelectImage.bind(this);
    this.handleToggleAssetPickerModal = this.handleToggleAssetPickerModal.bind(this);
    this.handleToggleUploader = this.handleToggleUploader.bind(this);
    this.handleChangeAside = this.handleChangeAside.bind(this);
  }

  componentDidMount() {
    this.handleSearchAudioAssets();
  }

  UNSAFE_componentWillReceiveProps({ isAudioAssetSearchFulfilled }) {
    const { isReadyToDisplay } = this.state;
    if (!isReadyToDisplay && isAudioAssetSearchFulfilled) {
      this.setState({ isReadyToDisplay: true });
    }
  }

  componentWillUnmount() {
    const { delegate } = this.props;
    delegate.handleClearAudioAssetChannel();
  }

  setBlock() {
    const {
      hasUpdatedDate,
      launchText,
      selectedAudioNode,
      selectedImageNode,
      updatedDate,
      aside,
    } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('node_ref', NodeRef.fromNode(selectedAudioNode))
      .set('image_ref', selectedImageNode ? NodeRef.fromNode(selectedImageNode) : null)
      .set('updated_date', hasUpdatedDate ? updatedDate.toDate() : null)
      .set('launch_text', launchText || null)
      .set('aside', aside);
  }

  handleAddBlock() {
    const { onAddBlock, toggle } = this.props;
    onAddBlock(this.setBlock());
    toggle();
  }

  handleChangeLaunchText({ target: { value: launchText } }) {
    this.setState({ launchText });
  }

  handleChangeHasUpdatedDate() {
    this.setState(({ hasUpdatedDate }) => ({ hasUpdatedDate: !hasUpdatedDate }));
  }

  handleChangeAside() {
    this.setState(({ aside }) => ({ aside: !aside }));
  }

  handleChangeQ({ target: { value: q } }) {
    this.setState({ q }, this.handleSearchAudioAssets);
  }

  handleChangeDate(date) {
    this.setState(changedDate(date));
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(changedTime(time));
  }

  handleClearImage() {
    this.setState({ selectedImageNode: null }, this.refocusModal);
  }

  handleToggleUploader(assets) {
    this.setState(({ isUploaderOpen }) => ({ isUploaderOpen: !isUploaderOpen }), () => {
      const { isUploaderOpen } = this.state;
      if (!isUploaderOpen) {
        if (assets) {
          this.handleSearchAudioAssets();
        }
        this.refocusModal();
      }
    });
  }

  handleEditBlock() {
    const { onEditBlock, toggle } = this.props;
    onEditBlock(this.setBlock());
    toggle();
  }

  handleDecrementStep() {
    this.setState(({ activeStep }) => ({ activeStep: activeStep - 1 }));
  }

  handleIncrementStep() {
    this.setState(({ activeStep }) => ({ activeStep: activeStep + 1 }));
  }

  // eslint-disable-next-line react/destructuring-assignment
  handleSearchAudioAssets(sort = this.props.audioAssetSort) {
    const { q } = this.state;
    const { delegate } = this.props;
    this.setState({ isReadyToDisplay: false }, () => {
      delegate.handleSearchAudioAssets({ q, sort });
    });
  }

  handleSelectAudio(selectedAudioNode) {
    this.setState({ selectedAudioNode });
  }

  handleSelectImage(selectedImageNode) {
    this.setState({ selectedImageNode });
  }

  handleToggleAssetPickerModal() {
    this.setState(({ isAssetPickerModalOpen }) => ({
      isAssetPickerModalOpen: !isAssetPickerModalOpen,
    }), () => {
      const { isAssetPickerModalOpen } = this.state;
      if (!isAssetPickerModalOpen) {
        this.refocusModal();
      }
    });
  }

  /**
   * Needs to return the focus to an element else pressing "ESC" to close the modal won't work
   */
  refocusModal() {
    this.button.focus();
  }

  render() {
    const {
      activeStep,
      isReadyToDisplay,
      launchText,
      q,
      hasUpdatedDate,
      isAssetPickerModalOpen,
      isUploaderOpen,
      selectedAudioNode,
      selectedImageNode,
      updatedDate,
      aside,
    } = this.state;
    const {
      isFreshBlock,
      isOpen,
      node,
      audioAssetNodes,
      audioAssetSort,
      toggle,
    } = this.props;

    return (
      <Modal
        autoFocus={false}
        centered
        isOpen={isOpen}
        toggle={toggle}
        size="xxl"
        keyboard={!isAssetPickerModalOpen && !isUploaderOpen}
      >
        <Header
          activeStep={activeStep}
          isFreshBlock={isFreshBlock}
          toggle={toggle}
        />
        <ModalBody className="p-0">
          {
            activeStep === 0
            && (
              <SearchBar
                onChangeQ={this.handleChangeQ}
                onClick={this.handleSearchAudioAssets}
                placeholder="Search audio assets..."
                value={q}
              />
            )
          }
          <ScrollableContainer
            className="bg-gray-400"
            style={{ height: `calc(100vh - ${activeStep === 0 ? 212 : 167}px)` }}
          >
            {
              !isReadyToDisplay && activeStep !== 1
              && <Spinner className="p-4" />
            }
            {
              isReadyToDisplay && activeStep === 0 && !audioAssetNodes.length
              && (
                <NotFoundMessage
                  isUploaderOpen={isUploaderOpen}
                  node={node}
                  onCloseUploader={this.handleCloseUploader}
                  onToggleUploader={this.handleToggleUploader}
                />
              )
            }
            {
              isReadyToDisplay && activeStep === 0 && !!audioAssetNodes.length
              && (
                <AudioAssetsTable
                  nodes={audioAssetNodes.filter((n) => ALLOWED_MIME_TYPES.includes(n.get('mime_type')))}
                  sort={audioAssetSort}
                  onSelectNode={this.handleSelectAudio}
                  onSort={(newSort) => this.handleSearchAudioAssets(newSort)}
                  selectedNode={selectedAudioNode}
                />
              )
            }
            {
              activeStep === 1
              && (
                <CustomizeOptions
                  block={this.setBlock()}
                  hasUpdatedDate={hasUpdatedDate}
                  isAssetPickerModalOpen={isAssetPickerModalOpen}
                  isImageSelected={!!selectedImageNode}
                  launchText={launchText}
                  node={node}
                  onChangeDate={this.handleChangeDate}
                  onChangeHasUpdatedDate={this.handleChangeHasUpdatedDate}
                  onChangeAside={this.handleChangeAside}
                  onChangeLaunchText={this.handleChangeLaunchText}
                  onChangeTime={this.handleChangeTime}
                  onClearImage={this.handleClearImage}
                  onSelectImage={this.handleSelectImage}
                  onToggleAssetPickerModal={this.handleToggleAssetPickerModal}
                  updatedDate={updatedDate}
                  aside={aside}
                />
              )
            }
          </ScrollableContainer>
        </ModalBody>
        <Footer
          activeStep={activeStep}
          innerRef={(el) => { this.button = el; }}
          isFreshBlock={isFreshBlock}
          isNextButtonDisabled={(activeStep === 0 && !selectedAudioNode) || activeStep === 1}
          isUploaderOpen={isUploaderOpen}
          node={node}
          onAddBlock={this.handleAddBlock}
          onDecrementStep={this.handleDecrementStep}
          onEditBlock={this.handleEditBlock}
          onIncrementStep={this.handleIncrementStep}
          onToggleUploader={this.handleToggleUploader}
          toggle={toggle}
        />
      </Modal>
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(AudioBlockModal);
