import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Message from '@gdbots/pbj/Message';
import AudioBlockPreview from '@triniti/cms/plugins/blocksmith/components/audio-block-preview';
import {
  Checkbox,
  FormGroup,
  Input,
  Label,
  DatePicker,
  Icon,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from '@triniti/admin-ui-plugin/components';
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
  onChangeLaunchText: handleChangeLaunchText,
  onChangeTime: handleChangeTime,
  onClearImage: handleClearImage,
  onSelectImage: handleSelectImage,
  onToggleAssetPickerModal: handleToggleAssetPickerModal,
  updatedDate,
}) => (
  <div className="modal-body-blocksmith">
    <AudioBlockPreview
      className="mb-4"
      block={block}
    />
    <FormGroup>
      <ImageAssetPicker
        multiAssetErrorMessage="Invalid Action: Trying to assign multiple Article Block Poster images."
        isImageSelected={isImageSelected}
        isModalOpen={isAssetPickerModalOpen}
        isDisabled={false}
        label="Select A Audio Block Poster Image"
        node={node}
        onClearImage={handleClearImage}
        onSelectImage={handleSelectImage}
        onToggleAssetPickerModal={handleToggleAssetPickerModal}
      />
    </FormGroup>
    <FormGroup inline className="d-flex justify-content-center form-group-mobile px-3 mb-2">
      <FormGroup>
        <Label className="d-flex justify-content-center text-nowrap align-items-center mb-0">
          Link Text
          <Input size="sm" className="ml-2 w-auto" value={launchText} onChange={handleChangeLaunchText} />
        </Label>
      </FormGroup>
      <FormGroup className="ml-4">
        <Checkbox size="sd" checked={hasUpdatedDate} onChange={handleChangeHasUpdatedDate}>
          Is Update
        </Checkbox>
      </FormGroup>
    </FormGroup>
    {
      hasUpdatedDate
      && (
        <FormGroup>
          <Label>
            Updated Time: {updatedDate.format('YYYY-MM-DD hh:mm A')}
          </Label>
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
      )
    }
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
  onChangeLaunchText: PropTypes.func.isRequired,
  onChangeTime: PropTypes.func.isRequired,
  onClearImage: PropTypes.func.isRequired,
  onSelectImage: PropTypes.func.isRequired,
  onToggleAssetPickerModal: PropTypes.func.isRequired,
  updatedDate: PropTypes.instanceOf(moment).isRequired,
};

export default CustomizeOptions;
