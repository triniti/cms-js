import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Message from '@gdbots/pbj/Message';
import {
  Checkbox,
  FormGroup,
  Label,
  Input,
} from '@triniti/admin-ui-plugin/components';
import VideoBlockPreview from '@triniti/cms/plugins/blocksmith/components/video-block-preview';
import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import ImageAssetPicker from '@triniti/cms/plugins/dam/components/image-asset-picker';

const CustomizeOptions = ({
  autoplay,
  block,
  handleChangeLaunchText,
  hasLaunchText,
  hasUpdatedDate,
  isAssetPickerModalOpen,
  isImageSelected,
  isMuted,
  launchText,
  node,
  onChangeCheckbox: handleChangeCheckbox,
  onChangeDate: handleChangeDate,
  onChangeTime: handleChangeTime,
  onClearImage: handleClearImage,
  onSelectImage: handleSelectImage,
  onToggleAssetPickerModal: handleToggleAssetPickerModal,
  updatedDate,
  willShowMoreVideos,
  aside,
}) => (
  <div className="modal-body-blocksmith video-block-preview-wrapper">
    <VideoBlockPreview
      className="video-preview-selected my-4"
      block={block}
      width={526}
    />
    <FormGroup>
      <ImageAssetPicker
        multiAssetErrorMessage="Invalid Action: Trying to assign multiple Video Block Poster images."
        isImageSelected={isImageSelected}
        isModalOpen={isAssetPickerModalOpen}
        isDisabled={false}
        label="Select A Video Block Poster Image"
        node={node}
        onClearImage={handleClearImage}
        onSelectImage={handleSelectImage}
        onToggleAssetPickerModal={handleToggleAssetPickerModal}
      />
    </FormGroup>
    <div style={{ maxWidth: '350px', margin: '0 auto' }}>
      <FormGroup className="d-flex mb-2">
        <FormGroup check>
          <Checkbox size="sd" id="autoplay" checked={autoplay} onChange={handleChangeCheckbox} disabled={isImageSelected}>
            Autoplay
          </Checkbox>
        </FormGroup>
      </FormGroup>
      <FormGroup className="d-flex mb-2">
        <FormGroup check>
          <Checkbox size="sd" id="isMuted" checked={isMuted} onChange={handleChangeCheckbox}>
            Automute
          </Checkbox>
        </FormGroup>
      </FormGroup>
      <FormGroup className="d-flex mb-2">
        <FormGroup check>
          <Checkbox size="sd" id="willShowMoreVideos" checked={willShowMoreVideos} onChange={handleChangeCheckbox}>
            Show related videos
          </Checkbox>
        </FormGroup>
      </FormGroup>
      <FormGroup className="d-flex align-items-start mb-2">
        <FormGroup check className="mr-2 pb-1">
          <Checkbox size="sd" id="hasLaunchText" checked={hasLaunchText} onChange={handleChangeCheckbox}>
            Override Launch Text
          </Checkbox>
        </FormGroup>
        {
          hasLaunchText
          && (
            <FormGroup className="mb-0">
              <Label className="mb-0">
                <Input size="sm" value={launchText || ''} onChange={handleChangeLaunchText} placeholder="Enter a caption..." />
              </Label>
            </FormGroup>
          )
        }
      </FormGroup>
      <FormGroup className="d-flex mb-2">
        <FormGroup check>
          <Checkbox size="sd" id="hasUpdatedDate" checked={hasUpdatedDate} onChange={handleChangeCheckbox}>
            Is update
          </Checkbox>
        </FormGroup>
      </FormGroup>
      {
        hasUpdatedDate
        && (
          <div className="modal-body-blocksmith">
            <DateTimePicker
              onChangeDate={handleChangeDate}
              onChangeTime={handleChangeTime}
              updatedDate={updatedDate}
            />
          </div>
        )
      }
      <FormGroup className="d-flex mb-2">
        <FormGroup check>
          <Checkbox size="sd" id="aside" checked={aside} onChange={handleChangeCheckbox}>
            Aside
          </Checkbox>
        </FormGroup>
      </FormGroup>
    </div>
  </div>
);

CustomizeOptions.propTypes = {
  autoplay: PropTypes.bool.isRequired,
  block: PropTypes.instanceOf(Message).isRequired,
  handleChangeLaunchText: PropTypes.func.isRequired,
  hasLaunchText: PropTypes.bool.isRequired,
  hasUpdatedDate: PropTypes.bool.isRequired,
  isAssetPickerModalOpen: PropTypes.bool.isRequired,
  isImageSelected: PropTypes.bool.isRequired,
  isMuted: PropTypes.bool.isRequired,
  launchText: PropTypes.string,
  node: PropTypes.instanceOf(Message).isRequired,
  onChangeCheckbox: PropTypes.func.isRequired,
  onChangeDate: PropTypes.func.isRequired,
  onChangeTime: PropTypes.func.isRequired,
  onClearImage: PropTypes.func.isRequired,
  onSelectImage: PropTypes.func.isRequired,
  onToggleAssetPickerModal: PropTypes.func.isRequired,
  willShowMoreVideos: PropTypes.bool.isRequired,
  updatedDate: PropTypes.instanceOf(moment).isRequired,
  aside: PropTypes.bool.isRequired,
};

CustomizeOptions.defaultProps = {
  launchText: null,
};

export default CustomizeOptions;
