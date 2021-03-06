import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import { Button } from '@triniti/admin-ui-plugin/components';
import ImageAssetPickerModal from '@triniti/cms/plugins/dam/components/image-asset-picker-modal';
import ImageAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/image-asset/ImageAssetV1Mixin';
import Message from '@gdbots/pbj/Message';

const assetTypes = [ImageAssetV1Mixin.findOne().getCurie().getMessage()];

const ImageAssetPicker = ({
  areLinkedImagesAllowed,
  galleryNode,
  innerRef,
  isDisabled,
  isImageSelected,
  isModalOpen,
  label,
  multiAssetErrorMessage,
  node,
  onClearImage: handleClearImage,
  onSelectImage: handleSelectImage,
  onToggleImageAssetPickerModal: handleToggleImageAssetPickerModal,
  selectedImage,
}) => {
  const handleCloseUploader = (image, toggleAllModals) => {
    if (image) {
      handleSelectImage(image);
    }
    if (toggleAllModals) {
      handleToggleImageAssetPickerModal();
    }
  };
  const handleSelect = (image) => {
    handleSelectImage(image);
    handleToggleImageAssetPickerModal();
  };
  return (
    <span>
      <Button
        className="mr-3"
        disabled={isDisabled}
        innerRef={innerRef}
        onClick={handleToggleImageAssetPickerModal}
      >
        {`Select a${isImageSelected ? ' new' : 'n'} Image`}
      </Button>
      <Button
        onClick={handleClearImage}
        disabled={!isImageSelected || isDisabled}
      >
        Clear Image
      </Button>
      <ImageAssetPickerModal
        areLinkedImagesAllowed={areLinkedImagesAllowed}
        assetTypes={assetTypes}
        galleryNode={galleryNode}
        isOpen={isModalOpen}
        label={label}
        multiAssetErrorMessage={multiAssetErrorMessage}
        node={node}
        onCloseUploader={handleCloseUploader}
        onSelectImage={handleSelect}
        onToggleModal={handleToggleImageAssetPickerModal}
        selectedImage={selectedImage}
      />
    </span>
  );
};

ImageAssetPicker.propTypes = {
  areLinkedImagesAllowed: PropTypes.bool,
  galleryNode: PropTypes.instanceOf(Message),
  innerRef: PropTypes.func,
  isDisabled: PropTypes.bool,
  isImageSelected: PropTypes.bool,
  isModalOpen: PropTypes.bool,
  label: PropTypes.string,
  multiAssetErrorMessage: PropTypes.string,
  node: PropTypes.instanceOf(Message),
  onClearImage: PropTypes.func,
  onSelectImage: PropTypes.func.isRequired,
  onToggleImageAssetPickerModal: PropTypes.func.isRequired,
  selectedImage: PropTypes.instanceOf(Message),
};

ImageAssetPicker.defaultProps = {
  areLinkedImagesAllowed: true,
  galleryNode: null,
  innerRef: noop,
  isDisabled: true,
  isImageSelected: false,
  isModalOpen: false,
  label: 'Select An Image',
  multiAssetErrorMessage: 'Invalid Action: Trying to assign multiple images.',
  node: null,
  onClearImage: noop,
  selectedImage: null,
};

export default ImageAssetPicker;
