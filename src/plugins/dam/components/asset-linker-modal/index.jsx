import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@triniti/admin-ui-plugin/components';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import Uploader from '@triniti/cms/plugins/dam/components/uploader';

import ImageSearch from '../image-search';

export default class AssetLinkerModal extends React.Component {
  static propTypes = {
    assetTypes: PropTypes.arrayOf(PropTypes.string),
    isOpen: PropTypes.bool,
    onAssetUploaded: PropTypes.func.isRequired,
    onLinkAssets: PropTypes.func.isRequired,
    onToggleModal: PropTypes.func.isRequired,
    nodeRef: PropTypes.instanceOf(NodeRef).isRequired,
  };

  static defaultProps = {
    assetTypes: [],
    isOpen: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedImages: [],
      isUploaderOpen: false,
    };

    this.clearSelectedImages = this.clearSelectedImages.bind(this);
    this.handleChangeQ = this.handleChangeQ.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.handleSelectImage = this.handleSelectImage.bind(this);
    this.handleToggleUploader = this.handleToggleUploader.bind(this);
    this.handleOpened = this.handleOpened.bind(this);
  }

  clearSelectedImages() {
    this.setState({
      selectedImages: [],
    });
  }

  handleOpened() {
    this.searchInput.focus();
  }

  async handleLinkClick() {
    const { selectedImages } = this.state;
    const { onLinkAssets } = this.props;
    await onLinkAssets(selectedImages.map((i) => i.get('_id').toNodeRef()));
    this.clearSelectedImages();
  }

  handleChangeQ() {
    this.clearSelectedImages();
  }

  handleCloseModal() {
    const { onToggleModal } = this.props;
    this.clearSelectedImages();
    onToggleModal();
  }

  handleSelectImage(image) {
    const imageId = image.get('_id').toString();
    this.setState((prevState) => {
      const selectedImages = [...prevState.selectedImages];

      if (selectedImages.map((i) => i.get('_id').toString()).includes(imageId)) {
        selectedImages.splice(selectedImages.map((i) => i.get('_id').toString()).indexOf(imageId), 1);
      } else {
        selectedImages.push(image);
      }

      return { selectedImages };
    });
  }

  handleToggleUploader(asset, toggleAllModals) {
    const { onAssetUploaded } = this.props;
    this.setState(({ isUploaderOpen }) => ({
      isUploaderOpen: !isUploaderOpen,
    }), () => {
      const { isUploaderOpen } = this.state;
      if (!isUploaderOpen) {
        if (toggleAllModals) {
          this.handleCloseModal();
        } else {
          this.searchInput.focus();
        }

        if (asset) {
          onAssetUploaded();
        }
      }
    });
  }

  render() {
    const { assetTypes, isOpen, nodeRef } = this.props;
    const { isUploaderOpen, selectedImages } = this.state;
    return (
      <div>
        <Modal onOpened={this.handleOpened} centered size="xxl" isOpen={isOpen} toggle={this.handleCloseModal}>
          <ModalHeader toggle={this.handleCloseModal}>
            <span className="nowrap">Select Images</span>
          </ModalHeader>
          <ModalBody className="p-0">
            <ImageSearch
              assetTypes={assetTypes}
              excludeRef={nodeRef}
              innerRef={(el) => { this.searchInput = el; }}
              onSelectImage={this.handleSelectImage}
              onChangeQ={this.handleChangeQ}
              onToggleUploader={this.handleToggleUploader}
              selectedImages={selectedImages}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              className="mr-auto"
              color="primary"
              onClick={this.handleToggleUploader}
            >
              Upload
            </Button>
            <Button
              onClick={this.handleLinkClick}
              disabled={!selectedImages.length}
            >
              Link Image{selectedImages.length > 1 ? 's' : ''}
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
        {isUploaderOpen
        && (
          <Uploader
            isOpen={isUploaderOpen}
            key="uploader"
            linkedRefs={[nodeRef]}
            onToggleUploader={this.handleToggleUploader}
          />
        )}
      </div>
    );
  }
}
