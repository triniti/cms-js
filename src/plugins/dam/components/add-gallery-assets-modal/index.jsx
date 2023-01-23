import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React from 'react';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import Uploader from 'plugins/dam/components/uploader';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';

import ImageSearch from '../image-search';

export const incrementValues = {
  ADD_GALLERY_ASSET_INCREMENT: 500,
};

export default class AddGalleryAssetsModal extends React.Component {
  static propTypes = {
    assetTypes: PropTypes.arrayOf(PropTypes.string),
    lastGallerySequence: PropTypes.number,
    isOpen: PropTypes.bool,
    nodeRef: PropTypes.instanceOf(NodeRef),
    onAddAssets: PropTypes.func.isRequired,
    onAssetsUploaded: PropTypes.func,
    onToggleModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    assetTypes: [],
    isOpen: false,
    lastGallerySequence: 0,
    nodeRef: null,
    onAssetsUploaded: noop,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedImages: [],
      isUploaderOpen: false,
    };

    this.handleAddAssetsClick = this.handleAddAssetsClick.bind(this);
    this.handleChangeQ = this.handleChangeQ.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleResetSelectedImages = this.handleResetSelectedImages.bind(this);
    this.handleSelectImage = this.handleSelectImage.bind(this);
    this.handleUploaderToggle = this.handleUploaderToggle.bind(this);
  }

  async handleAddAssetsClick() {
    const { selectedImages } = this.state;
    const { lastGallerySequence, onAddAssets } = this.props;

    const assetMap = selectedImages.reduce((obj, assetId, currentIndex) => {
      const assets = Object.assign(obj);
      assets[assetId.get('_id').toString()] = lastGallerySequence + (selectedImages.length - currentIndex) * incrementValues.ADD_GALLERY_ASSET_INCREMENT;
      return assets;
    }, {});

    try {
      await onAddAssets(assetMap);
      this.handleCloseModal();
    } catch (e) {
      // continue regardless of error
    }
  }

  handleChangeQ() {
    this.handleResetSelectedImages();
  }

  handleResetSelectedImages() {
    this.setState({ selectedImages: [] });
  }

  handleCloseModal() {
    const { onToggleModal } = this.props;
    this.setState({ selectedImages: [] });
    onToggleModal();
  }

  handleSelectImage(image) {
    const imageId = image.get('_id').toString();
    const { selectedImages } = this.state;
    const newSelectedImages = [...selectedImages];
    if (newSelectedImages.map((i) => i.get('_id').toString()).includes(imageId)) {
      newSelectedImages.splice(newSelectedImages.map((i) => i.get('_id').toString()).indexOf(imageId), 1);
    } else {
      newSelectedImages.push(image);
    }
    this.setState({ selectedImages: newSelectedImages });
  }

  handleUploaderToggle() {
    this.setState(({ isUploaderOpen }) => ({
      isUploaderOpen: !isUploaderOpen,
    }), () => {
      const { isUploaderOpen } = this.state;
      if (!isUploaderOpen) {
        const { onAssetsUploaded } = this.props;
        // close previous linker modal
        this.handleCloseModal();
        onAssetsUploaded();
      }
    });
  }

  render() {
    const { assetTypes, lastGallerySequence, isOpen, nodeRef } = this.props;
    const { isUploaderOpen, selectedImages } = this.state;
    return (
      <div>
        <Modal centered size="xxl" isOpen={isOpen} toggle={this.handleCloseModal}>
          <ModalHeader toggle={this.handleCloseModal}>
            <span className="nowrap">Select Images</span>
          </ModalHeader>
          <ModalBody className="p-0">
            <ImageSearch
              assetTypes={assetTypes}
              excludeAllWithRefType="gallery_ref"
              onChangeQ={this.handleChangeQ}
              onToggleUploader={this.handleUploaderToggle}
              onSelectImage={this.handleSelectImage}
              selectedImages={selectedImages}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              className="mr-auto"
              color="primary"
              onClick={this.handleUploaderToggle}
            >
              Upload
            </Button>
            <Button
              onClick={this.handleAddAssetsClick}
              disabled={!selectedImages.length}
            >
              Add Image{selectedImages.length > 1 ? 's' : ''}
              {selectedImages.length > 0 ? <span className="badge badge-danger badge-alert">{selectedImages.length}</span> : null}
            </Button>
            <Button
              disabled={!!selectedImages.length}
              onClick={this.handleCloseModal}
            >
              Close
            </Button>
            <Button onClick={this.handleCloseModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        {isUploaderOpen && (
        <Uploader
          allowedMimeTypes={['image/jpeg', 'image/png']}
          galleryRef={nodeRef}
          isOpen={isUploaderOpen}
          key="uploader"
          lastGallerySequence={lastGallerySequence}
          mimeTypeErrorMessage="Invalid Action: attempt to upload non-image asset. Please upload only JPEGs or PNGs."
          onToggleUploader={this.handleUploaderToggle}
        />
        )}
      </div>
    );
  }
}
