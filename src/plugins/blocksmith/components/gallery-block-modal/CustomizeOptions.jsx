import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import GalleryBlockPreview from '@triniti/cms/plugins/blocksmith/components/gallery-block-preview';
import ImageAssetPicker from '@triniti/cms/plugins/dam/components/image-asset-picker';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import {
  Checkbox,
  FormGroup,
  Icon,
  Input,
  Label,
} from '@triniti/admin-ui-plugin/components';

const CustomizeOptions = ({
  aside,
  block,
  hasUpdatedDate,
  isAssetPickerModalOpen,
  isImageSelected,
  launchText,
  node,
  onChangeCheckBox: handleChangeCheckbox,
  onChangeDate: handleChangeDate,
  onChangeStartAtPoster: handleChangeStartAtPoster,
  onChangeLaunchText: handleChangeLaunchText,
  onChangeTime: handleChangeTime,
  onClearImage: handleClearImage,
  onSelectImage: handleSelectImage,
  onToggleAssetPickerModal: handleToggleAssetPickerModal,
  selectedGallery,
  selectedImage,
  updatedDate,
  startsAtPoster,
}) => (
  <div className="modal-body-blocksmith">
    <GalleryBlockPreview className="mb-3" block={block} />
    <FormGroup>
      <ImageAssetPicker
        galleryNode={selectedGallery}
        isDisabled={false}
        isImageSelected={isImageSelected}
        isModalOpen={isAssetPickerModalOpen}
        label="Select A Gallery Block Poster Image"
        multiAssetErrorMessage="Invalid Action: Trying to assign multiple Gallery Block Poster images."
        node={node}
        onClearImage={handleClearImage}
        onSelectImage={handleSelectImage}
        onToggleAssetPickerModal={handleToggleAssetPickerModal}
        selectedImage={selectedImage}
      />
    </FormGroup>
    <FormGroup inline className="d-flex justify-content-center form-group-mobile px-3 mb-2">
      <FormGroup>
        <Label className="d-flex justify-content-center text-nowrap align-items-center mb-0">
          Launch Text
          <Input
            size="sm"
            className="ml-2 mr-3 w-auto"
            value={launchText}
            onChange={handleChangeLaunchText}
            placeholder="custom launch text..."
          />
        </Label>
      </FormGroup>
      <FormGroup className="mr-4">
        <Checkbox size="sd" id="hasUpdatedDate" checked={hasUpdatedDate} onChange={handleChangeCheckbox}>
          Is update
        </Checkbox>
        <Checkbox size="sd" id="aside" checked={aside} onChange={handleChangeCheckbox} className="ml-3">
          Aside
        </Checkbox>
        <Icon imgSrc="info-outline" id="aside-tooltip" size="xs" className="ml-1" />
        <UncontrolledTooltip target="aside-tooltip">Is only indirectly related to the main content.</UncontrolledTooltip>
        <Checkbox
          size="sd"
          checked={startsAtPoster}
          onChange={handleChangeStartAtPoster}
          className="ml-3"
        >
          Start At Poster Image
        </Checkbox>
      </FormGroup>
    </FormGroup>
    {hasUpdatedDate
    && (
      <DateTimePicker
        onChangeDate={handleChangeDate}
        onChangeTime={handleChangeTime}
        updatedDate={updatedDate}
      />
    )}
  </div>
);

CustomizeOptions.propTypes = {
  aside: PropTypes.bool.isRequired,
  block: PropTypes.instanceOf(Message).isRequired,
  hasUpdatedDate: PropTypes.bool.isRequired,
  isAssetPickerModalOpen: PropTypes.bool.isRequired,
  isImageSelected: PropTypes.bool.isRequired,
  launchText: PropTypes.string.isRequired,
  node: PropTypes.instanceOf(Message).isRequired,
  onChangeCheckBox: PropTypes.func.isRequired,
  onChangeDate: PropTypes.func.isRequired,
  onChangeStartAtPoster: PropTypes.func.isRequired,
  onChangeLaunchText: PropTypes.func.isRequired,
  onChangeTime: PropTypes.func.isRequired,
  onClearImage: PropTypes.func.isRequired,
  onSelectImage: PropTypes.func.isRequired,
  onToggleAssetPickerModal: PropTypes.func.isRequired,
  selectedGallery: PropTypes.instanceOf(Message).isRequired,
  selectedImage: PropTypes.instanceOf(Message),
  updatedDate: PropTypes.instanceOf(Date).isRequired,
  startsAtPoster: PropTypes.bool.isRequired,
};

CustomizeOptions.defaultProps = {
  selectedImage: null,
};

export default CustomizeOptions;
