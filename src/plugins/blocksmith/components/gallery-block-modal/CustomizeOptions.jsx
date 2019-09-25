import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Checkbox,
  DatePicker,
  FormGroup,
  Icon,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
} from '@triniti/admin-ui-plugin/components';
import Message from '@gdbots/pbj/Message';
import GalleryBlockPreview from '@triniti/cms/plugins/blocksmith/components/gallery-block-preview';
import ImageAssetPicker from '@triniti/cms/plugins/dam/components/image-asset-picker';

const CustomizeOptions = ({
  block,
  hasUpdatedDate,
  isAssetPickerModalOpen,
  isImageSelected,
  launchText,
  node,
  onChangeDate: handleChangeDate,
  onChangeHasUpdatedDate: handleChangeHasUpdatedDate,
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
        <Checkbox size="sd" checked={hasUpdatedDate} onChange={handleChangeHasUpdatedDate}>
          Is update
        </Checkbox>
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
    {hasUpdatedDate && (
      <FormGroup>
        <Label>Updated Time: {updatedDate.format('YYYY-MM-DD hh:mm A')}</Label>
        <FormGroup className="mb-3 mt-1 shadow-none">
          <DatePicker
            onChange={handleChangeDate}
            selected={updatedDate}
            shouldCloseOnSelect={false}
            inline
          />
          <InputGroup style={{ width: '15rem', margin: 'auto' }}>
            <InputGroupAddon addonType="prepend" className="text-dark">
              <InputGroupText>
                <Icon imgSrc="clock-outline" />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              type="time"
              onChange={handleChangeTime}
              defaultValue={updatedDate.format('HH:mm')}
            />
          </InputGroup>
        </FormGroup>
      </FormGroup>
    )}
  </div>
);

CustomizeOptions.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
  hasUpdatedDate: PropTypes.bool.isRequired,
  isAssetPickerModalOpen: PropTypes.bool.isRequired,
  isImageSelected: PropTypes.bool.isRequired,
  launchText: PropTypes.string.isRequired,
  node: PropTypes.instanceOf(Message).isRequired,
  onChangeDate: PropTypes.func.isRequired,
  onChangeHasUpdatedDate: PropTypes.func.isRequired,
  onChangeStartAtPoster: PropTypes.func.isRequired,
  onChangeLaunchText: PropTypes.func.isRequired,
  onChangeTime: PropTypes.func.isRequired,
  onClearImage: PropTypes.func.isRequired,
  onSelectImage: PropTypes.func.isRequired,
  onToggleAssetPickerModal: PropTypes.func.isRequired,
  selectedGallery: PropTypes.instanceOf(Message).isRequired,
  selectedImage: PropTypes.instanceOf(Message),
  updatedDate: PropTypes.instanceOf(moment).isRequired,
  startsAtPoster: PropTypes.bool.isRequired,
};

CustomizeOptions.defaultProps = {
  selectedImage: null,
};

export default CustomizeOptions;
