import { connect } from 'react-redux';
import AspectRatioEnum from '@triniti/schemas/triniti/common/enums/AspectRatio';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import GalleryGrid from '@triniti/cms/plugins/curator/components/gallery-grid';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Modal,
  ModalBody,
  ScrollableContainer,
  Spinner,
} from '@triniti/admin-ui-plugin/components';

import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';
import CustomizeOptions from './CustomizeOptions';
import delegateFactory from './delegate';
import Footer from './Footer';
import Header from './Header';
import SearchBar from '../search-bar';
import selector from './selector';
import './styles.scss';

class GalleryBlockModal extends React.Component {
  static propTypes = {
    blockKey: PropTypes.string.isRequired,
    block: PropTypes.instanceOf(Message).isRequired,
    galleries: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
    gallery: PropTypes.instanceOf(Message),
    image: PropTypes.instanceOf(Message),
    isFreshBlock: PropTypes.bool.isRequired,
    isGallerySearchRequestFulfilled: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool,
    node: PropTypes.instanceOf(Message),
    onAddBlock: PropTypes.func.isRequired,
    onEditBlock: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
    delegate: PropTypes.shape({
      handleClearGalleryChannel: PropTypes.func.isRequired,
      handleSearchGalleries: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    gallery: null,
    image: null,
    node: null,
    isOpen: false,
  };

  constructor(props) {
    super(props);
    const { block, gallery, image } = props;
    this.state = {
      activeStep: 0,
      aside: block.get('aside'),
      aspectRatio: block.get('aspect_ratio', AspectRatioEnum.AUTO),
      galleryQ: '',
      hasUpdatedDate: block.has('updated_date'),
      isImageAssetPickerModalOpen: false,
      isReadyToDisplay: false,
      launchText: block.get('launch_text', ''),
      selectedGallery: gallery || null,
      selectedImage: image || null,
      startsAtPoster: block.get('start_at_poster'),
      updatedDate: block.get('updated_date', new Date()),
    };
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeAspectRatio = this.handleChangeAspectRatio.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeLaunchText = this.handleChangeLaunchText.bind(this);
    this.handleChangeQ = this.handleChangeQ.bind(this);
    this.handleChangeStartAtPoster = this.handleChangeStartAtPoster.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleClearImage = this.handleClearImage.bind(this);
    this.handleDecrementStep = this.handleDecrementStep.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
    this.handleIncrementStep = this.handleIncrementStep.bind(this);
    this.handleSearchGalleries = this.handleSearchGalleries.bind(this);
    this.handleSelectGallery = this.handleSelectGallery.bind(this);
    this.handleSelectImage = this.handleSelectImage.bind(this);
    this.handleToggleImageAssetPickerModal = this.handleToggleImageAssetPickerModal.bind(this);
  }

  componentDidMount() {
    const { delegate } = this.props;
    delegate.handleSearchGalleries();
  }

  UNSAFE_componentWillReceiveProps({ isGallerySearchRequestFulfilled }) {
    const { isReadyToDisplay } = this.state;
    if (!isReadyToDisplay && isGallerySearchRequestFulfilled) {
      this.setState({ isReadyToDisplay: true });
    }
  }

  componentWillUnmount() {
    const { delegate } = this.props;
    delegate.handleClearGalleryChannel();
  }

  setBlock() {
    const {
      aside,
      aspectRatio,
      hasUpdatedDate,
      startsAtPoster,
      launchText,
      selectedImage,
      selectedGallery,
      updatedDate,
    } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('aside', aside)
      .set('aspect_ratio', aspectRatio)
      .set('launch_text', launchText || null)
      .set('node_ref', selectedGallery ? selectedGallery.get('_id').toNodeRef(): null)
      .set('poster_image_ref', selectedImage ? NodeRef.fromNode(selectedImage) : null)
      .set('start_at_poster', startsAtPoster)
      .set('updated_date', hasUpdatedDate ? updatedDate : null);
  }

  handleAddBlock() {
    const { onAddBlock, toggle, blockKey } = this.props;
    onAddBlock(this.setBlock(), blockKey);
    toggle();
  }

  handleEditBlock() {
    const { onEditBlock, toggle, blockKey } = this.props;
    onEditBlock(this.setBlock(), blockKey);
    toggle();
  }

  handleChangeAspectRatio(option) {
    this.setState({ aspectRatio: AspectRatioEnum.create(option.value) });
  }

  handleChangeCheckbox({ target: { id, checked } }) {
    this.setState({ [id]: checked });
  }

  handleChangeLaunchText({ target: { value: launchText } }) {
    this.setState({ launchText });
  }

  handleChangeStartAtPoster() {
    this.setState(({ startsAtPoster }) => ({
      startsAtPoster: !startsAtPoster,
    }));
  }

  handleChangeDate(date) {
    this.setState(changedDate(date));
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(changedTime(time));
  }

  handleChangeQ({ target: { value: galleryQ } }) {
    this.setState({ galleryQ }, this.handleSearchGalleries);
  }

  handleDecrementStep() {
    this.setState(({ activeStep }) => ({ activeStep: activeStep - 1 }));
  }

  handleIncrementStep() {
    this.setState(({ activeStep }) => ({ activeStep: activeStep + 1 }));
  }

  handleClearImage() {
    this.setState({ selectedImage: null }, this.refocusModal);
  }

  handleSearchGalleries() {
    const { galleryQ } = this.state;
    const { delegate } = this.props;
    this.setState({ isReadyToDisplay: false }, () => {
      delegate.handleSearchGalleries({ q: galleryQ });
    });
  }

  handleSelectGallery(gallery) {
    this.setState({ selectedGallery: gallery });
  }

  handleSelectImage(image) {
    this.setState({ selectedImage: image });
  }

  handleToggleImageAssetPickerModal() {
    this.setState(({ isImageAssetPickerModalOpen }) => ({
      isImageAssetPickerModalOpen: !isImageAssetPickerModalOpen,
    }), () => {
      const { isImageAssetPickerModalOpen } = this.state;
      if (!isImageAssetPickerModalOpen) {
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
      aside,
      aspectRatio,
      galleryQ,
      hasUpdatedDate,
      isImageAssetPickerModalOpen,
      isReadyToDisplay,
      launchText,
      selectedGallery,
      selectedImage,
      startsAtPoster,
      updatedDate,
    } = this.state;

    const {
      blockKey, 
      isOpen, 
      isFreshBlock, 
      toggle, 
      galleries, 
      node 
    } = this.props;

    return (
      <Modal
        autoFocus={false}
        centered
        isOpen={isOpen}
        toggle={toggle}
        size="xxl"
        keyboard={!isImageAssetPickerModalOpen}
      >
        <Header activeStep={activeStep} isFreshBlock={isFreshBlock} toggle={toggle} />
        <ModalBody className="p-0">
          {activeStep === 0 && (
            <SearchBar
              onChangeQ={this.handleChangeQ}
              onClick={this.handleSearchGalleries}
              placeholder="Search galleries..."
              value={galleryQ}
            />
          )}
          {
            <ScrollableContainer
              className="bg-gray-400"
              style={{
                height: `calc(100vh - ${activeStep === 0 ? 212 : 167}px)`,
              }}
            >
              {isReadyToDisplay && activeStep === 0 && !!galleries.length && (
                <GalleryGrid
                  galleries={galleries}
                  onSelectGallery={this.handleSelectGallery}
                  selectedGalleries={selectedGallery ? [selectedGallery] : []}
                />
              )}
              {activeStep === 1 && (
                <CustomizeOptions
                  aside={aside}
                  aspectRatio={aspectRatio}
                  block={this.setBlock()}
                  hasUpdatedDate={hasUpdatedDate}
                  isImageAssetPickerModalOpen={isImageAssetPickerModalOpen}
                  isImageSelected={!!selectedImage}
                  launchText={launchText}
                  node={node}
                  onChangeAspectRatio={this.handleChangeAspectRatio}
                  onChangeCheckBox={this.handleChangeCheckbox}
                  onChangeDate={this.handleChangeDate}
                  onChangeLaunchText={this.handleChangeLaunchText}
                  onChangeStartAtPoster={this.handleChangeStartAtPoster}
                  onChangeTime={this.handleChangeTime}
                  onClearImage={this.handleClearImage}
                  onSelectImage={this.handleSelectImage}
                  onToggleImageAssetPickerModal={this.handleToggleImageAssetPickerModal}
                  selectedGallery={selectedGallery}
                  selectedImage={selectedImage}
                  startsAtPoster={startsAtPoster}
                  updatedDate={updatedDate}
                />
              )}
              {isReadyToDisplay && activeStep === 0 && !galleries.length && (
                <div className="not-found-message">
                  <p>No galleries found that match your search.</p>
                </div>
              )}
              {!isReadyToDisplay && activeStep === 0 && (
                <Spinner centered style={activeStep === 1 ? { height: 'auto' } : {}} />
              )}
            </ScrollableContainer>
          }
        </ModalBody>
        <Footer
          blockKey={blockKey}
          block={this.setBlock()}
          activeStep={activeStep}
          innerRef={(el) => {
            this.button = el;
          }}
          isFreshBlock={isFreshBlock}
          isNextButtonDisabled={(activeStep === 0 && !selectedGallery) || activeStep === 1}
          onAddBlock={this.handleAddBlock}
          onDecrementStep={this.handleDecrementStep}
          onEditBlock={this.handleEditBlock}
          onIncrementStep={this.handleIncrementStep}
          toggle={toggle}
        />
      </Modal>
    );
  }
}

export default connect(
  selector,
  createDelegateFactory(delegateFactory),
)(GalleryBlockModal);
