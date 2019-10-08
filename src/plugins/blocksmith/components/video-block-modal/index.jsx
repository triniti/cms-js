import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import createDelegateFactory from '@triniti/app/createDelegateFactory';
import Message from '@gdbots/pbj/Message';
import VideosTable from '@triniti/cms/plugins/ovp/components/videos-table';
import {
  Modal,
  ModalBody,
  ScrollableContainer,
  Spinner,
} from '@triniti/admin-ui-plugin/components';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';
import CustomizeOptions from './CustomizeOptions';
import Footer from './Footer';
import Header from './Header';
import SearchBar from '../search-bar';
import delegateFactory from './delegate';
import selector from './selector';
import './styles.scss';

class VideoBlockModal extends React.Component {
  static propTypes = {
    block: PropTypes.instanceOf(Message).isRequired,
    getNode: PropTypes.func.isRequired,
    imageNode: PropTypes.instanceOf(Message),
    isFreshBlock: PropTypes.bool.isRequired,
    isFulfilled: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool,
    node: PropTypes.instanceOf(Message),
    onAddBlock: PropTypes.func.isRequired,
    onEditBlock: PropTypes.func.isRequired,
    sort: PropTypes.string.isRequired,
    toggle: PropTypes.func.isRequired,
    video: PropTypes.instanceOf(Message),
    videos: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
    delegate: PropTypes.shape({
      handleClearChannel: PropTypes.func.isRequired,
      handleSearch: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    imageNode: null,
    isOpen: false,
    node: null,
    video: null,
  };

  constructor(props) {
    super(props);
    const { block, imageNode, video } = props;
    this.state = {
      activeStep: 0,
      autoplay: block.get('autoplay'),
      launchText: block.get('launch_text'),
      hasLaunchText: block.has('launch_text'),
      hasUpdatedDate: block.has('updated_date'),
      isAssetPickerModalOpen: false,
      isMuted: block.get('muted'),
      q: '',
      selectedImageNode: imageNode || null,
      selectedVideo: video || null,
      updatedDate: block.has('updated_date') ? moment(block.get('updated_date')) : moment(),
      willShowMoreVideos: block.get('show_more_videos'),
      aside: block.get('aside'),
    };
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeLaunchText = this.handleChangeLaunchText.bind(this);
    this.handleChangeQ = this.handleChangeQ.bind(this);
    this.handleChangeStep = this.handleChangeStep.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleClearImage = this.handleClearImage.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
    this.handleSearchVideos = this.handleSearchVideos.bind(this);
    this.handleSelectImage = this.handleSelectImage.bind(this);
    this.handleSelectVideo = this.handleSelectVideo.bind(this);
    this.handleToggleAssetPickerModal = this.handleToggleAssetPickerModal.bind(this);
  }

  componentDidMount() {
    const { delegate } = this.props;
    delegate.handleSearch();
  }

  componentWillUnmount() {
    const { delegate } = this.props;
    delegate.handleClearChannel();
  }

  setBlock() {
    const {
      autoplay,
      hasLaunchText,
      hasUpdatedDate,
      isMuted,
      launchText,
      selectedImageNode,
      selectedVideo,
      updatedDate,
      willShowMoreVideos,
      aside,
    } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('autoplay', autoplay)
      .set('launch_text', (hasLaunchText && launchText) || null)
      .set('muted', isMuted)
      .set('node_ref', selectedVideo.get('_id').toNodeRef())
      .set('show_more_videos', willShowMoreVideos)
      .set('updated_date', hasUpdatedDate ? updatedDate.toDate() : null)
      .set('poster_image_ref', selectedImageNode ? NodeRef.fromNode(selectedImageNode) : null)
      .set('aside', aside);
  }

  handleAddBlock() {
    const { onAddBlock, toggle } = this.props;
    onAddBlock(this.setBlock());
    toggle();
  }

  handleEditBlock() {
    const { onEditBlock, toggle } = this.props;
    onEditBlock(this.setBlock());
    toggle();
  }

  handleChangeDate(date) {
    this.setState(changedDate(date));
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(changedTime(time));
  }

  handleChangeCheckbox({ target: { id, checked } }) {
    this.setState({ [id]: checked });
  }

  handleChangeLaunchText({ target: { value: launchText } }) {
    this.setState({ launchText });
  }

  handleChangeStep() {
    this.setState(({ activeStep }) => ({ activeStep: activeStep ? 0 : 1 }), () => {
      const { activeStep } = this.state;
      if (activeStep === 1) {
        this.refocusModal();
      }
    });
  }

  handleChangeQ({ target: { value: q } }) {
    this.setState({ q }, this.handleSearchVideos);
  }

  // eslint-disable-next-line react/destructuring-assignment
  handleSearchVideos(sort = this.props.sort) {
    const { q } = this.state;
    const { delegate } = this.props;
    delegate.handleSearch({ q, sort });
  }

  handleSelectVideo(nodeRef) {
    const { getNode } = this.props;
    this.setState({ selectedVideo: getNode(nodeRef) });
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

  handleClearImage() {
    this.setState({ selectedImageNode: null }, this.refocusModal);
  }

  handleSelectImage(imageNode) {
    this.setState({
      autoplay: false,
      selectedImageNode: imageNode,
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
      autoplay,
      hasLaunchText,
      hasUpdatedDate,
      isAssetPickerModalOpen,
      isMuted,
      launchText,
      q,
      selectedImageNode,
      selectedVideo,
      updatedDate,
      willShowMoreVideos,
      aside,
    } = this.state;

    const {
      isOpen,
      isFreshBlock,
      isFulfilled,
      node,
      sort,
      toggle,
      videos,
    } = this.props;

    return (
      <Modal
        autoFocus={false}
        centered
        isOpen={isOpen}
        toggle={toggle}
        size="xxl"
        keyboard={!isAssetPickerModalOpen}
      >
        <Header
          activeStep={activeStep}
          isFreshBlock={isFreshBlock}
          toggle={toggle}
        />
        <ModalBody className="p-0 bg-gray-400">
          {
            activeStep === 0
            && (
            <SearchBar
              onChangeQ={this.handleChangeQ}
              onClick={this.handleSearchVideos}
              placeholder="search videos..."
              value={q}
            />
            )
          }
          <ScrollableContainer
            className="bg-gray-400"
            style={{ height: `calc(100vh - ${activeStep === 0 ? 212 : 167}px)` }}
            key="videoGrid"
          >
            {
              !isFulfilled && <Spinner centered />
            }
            {
              activeStep === 0 && isFulfilled
              && (
                <VideosTable
                  hasCheckboxes={false}
                  nodes={videos}
                  onSelectRow={this.handleSelectVideo}
                  onSort={(newSort) => this.handleSearchVideos(newSort)}
                  options={{
                    edit: false,
                    view: false,
                    openInNewTab: true,
                  }}
                  selectedRows={selectedVideo ? [NodeRef.fromNode(selectedVideo)] : []}
                  sort={sort}
                  striped
                />
              )
            }
            {
              activeStep === 1
              && (
                <CustomizeOptions
                  autoplay={autoplay}
                  block={this.setBlock()}
                  handleChangeLaunchText={this.handleChangeLaunchText}
                  hasLaunchText={hasLaunchText}
                  hasUpdatedDate={hasUpdatedDate}
                  isAssetPickerModalOpen={isAssetPickerModalOpen}
                  isImageSelected={!!selectedImageNode}
                  isMuted={isMuted}
                  launchText={launchText}
                  node={node}
                  onChangeCheckbox={this.handleChangeCheckbox}
                  onChangeDate={this.handleChangeDate}
                  onChangeTime={this.handleChangeTime}
                  onClearImage={this.handleClearImage}
                  onSelectImage={this.handleSelectImage}
                  onToggleAssetPickerModal={this.handleToggleAssetPickerModal}
                  updatedDate={updatedDate}
                  willShowMoreVideos={willShowMoreVideos}
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
          onAddBlock={this.handleAddBlock}
          onChangeStep={this.handleChangeStep}
          onEditBlock={this.handleEditBlock}
          selectedVideo={selectedVideo}
          toggle={toggle}
        />
      </Modal>
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(VideoBlockModal);
