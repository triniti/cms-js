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

export default function LinkAssetModel (props) {
  const {
    assetTypes = ['image-asset'],
    nodeRef,
    onAssetsUploaded = noop,
    onAddAssets,
    onCloseModal,
    actionBtnText = 'Link Image',
    imageSearchProps = {},
    uploaderProps = {},
  } = props;
  
  const [ selectedImages, setSelectedImages ] = useState([]);
  const [ isUploaderOpen, setIsUploaderOpen ] = useState(false);
  
  const handleAddAssets = async () => {
    try {
      await onAddAssets(selectedImages);
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
    props.toggle();
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
    <>
      <Modal isOpen size="xxl" toggle={handleCloseModal} backdrop="static" centered>
        <ModalHeader toggle={props.toggle}>
          <span className="nowrap">Select Images</span>
        </ModalHeader>
        <ModalBody className="p-0">
          <ImageSearch
            nodeRef={nodeRef}
            assetTypes={assetTypes}
            onChangeQ={handleChangeQ}
            onToggleUploader={handleUploaderToggle}
            onSelectImage={handleSelectImage}
            selectedImages={selectedImages}
            {...imageSearchProps}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            className="me-auto"
            color="primary"
            onClick={() => setIsUploaderOpen(true)}
          >
            Upload
          </Button>
          <Button
            onClick={handleAddAssets}
            disabled={!selectedImages.length}
            color="success"
          >
            {actionBtnText}{selectedImages.length > 1 ? 's' : ''}
            {selectedImages.length > 0 ? <span className="badge badge-danger badge-alert">{selectedImages.length}</span> : null}
          </Button>
          <Button onClick={handleCloseModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      {isUploaderOpen && (
      <Uploader
        allowedMimeTypes={['image/jpeg', 'image/png']}
        isOpen={isUploaderOpen}
        key="uploader"
        mimeTypeErrorMessage="Invalid Action: attempt to upload non-image asset. Please upload only JPEGs or PNGs."
        onToggleUploader={handleUploaderToggle}
        {...uploaderProps}
      />
      )}
    </>
  );
}
