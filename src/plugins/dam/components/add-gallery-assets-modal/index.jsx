import noop from 'lodash/noop';
import React, { useState } from 'react';
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

export default function AddGalleryAssetsModal ({
  assetTypes = [],
  isOpen = false,
  lastGallerySequence = 0,
  nodeRef,
  onAssetsUploaded = noop,
  onAddAssets,
  onCloseModal,
}) {
  
  const [ selectedImages, setSelectedImages ] = useState([]);
  const [ isUploaderOpen, setIsUploaderOpen ] = useState(false);
  
  const handleAddAssets = async () => {
    const assetMap = selectedImages.reduce((obj, assetId, currentIndex) => {
      const assets = Object.assign(obj);
      assets[`${assetId.get('_id')}`] = lastGallerySequence + (selectedImages.length - currentIndex) * incrementValues.ADD_GALLERY_ASSET_INCREMENT;
      return assets;
    }, {});

    try {
      await onAddAssets(assetMap);
      handleCloseModal();
    } catch (e) {
      // continue regardless of error
    }
  }

  const handleChangeQ = () => {
    handleResetSelectedImages();
  }

  const handleResetSelectedImages = () => {
    setSelectedImages([]);
  }

  const handleCloseModal = () => {
    setSelectedImages([]);
    onCloseModal();
  }

  const handleSelectImage = (image) => {
    const imageId = `${image.get('_id')}`;
    const newSelectedImages = [...selectedImages];
    if (newSelectedImages.map((i) => `${i.get('_id')}`).includes(imageId)) {
      newSelectedImages.splice(newSelectedImages.map((i) => `${i.get('_id')}`).indexOf(imageId), 1);
    } else {
      newSelectedImages.push(image);
    }
    setSelectedImages(newSelectedImages);
  }

  const handleUploaderToggle = () => {
    onAssetsUploaded();
    handleCloseModal();
    setIsUploaderOpen(!isUploaderOpen);
  }
  
  return (
    <div>
      <Modal centered size="xxl" isOpen={isOpen} toggle={handleCloseModal}>
        <ModalHeader toggle={handleCloseModal}>
          <span className="nowrap">Select Images</span>
        </ModalHeader>
        <ModalBody className="p-0">
          <ImageSearch
            nodeRef={nodeRef}
            assetTypes={assetTypes}
            excludeAllWithRefType="gallery_ref"
            onChangeQ={handleChangeQ}
            onToggleUploader={handleUploaderToggle}
            onSelectImage={handleSelectImage}
            selectedImages={selectedImages}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            className="me-auto"
            color="primary"
            onClick={handleUploaderToggle}
          >
            Upload
          </Button>
          <Button
            onClick={handleAddAssets}
            disabled={!selectedImages.length}
          >
            Add Image{selectedImages.length > 1 ? 's' : ''}
            {selectedImages.length > 0 ? <span className="badge badge-danger badge-alert">{selectedImages.length}</span> : null}
          </Button>
          <Button
            disabled={!!selectedImages.length}
            onClick={handleCloseModal}
          >
            Close
          </Button>
          <Button onClick={handleCloseModal}>
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
        onToggleUploader={handleUploaderToggle}
      />
      )}
    </div>
  );
}
