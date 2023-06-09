import AudioBlockPreview from '@triniti/cms/plugins/blocksmith/components/audio-block-preview';
import ImageAssetPicker from '@triniti/cms/plugins/dam/components/image-asset-picker';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import {
  Checkbox,
  FormGroup,
  Input,
  Label,
  Icon,
} from '@triniti/admin-ui-plugin/components';

const CustomizeOptions = ({
  aside,
  block,
  isImageAssetPickerModalOpen,
  isImageSelected,
  launchText,
  node,
  onChangeCheckBox: handleChangeCheckbox,
  onChangeLaunchText: handleChangeLaunchText,
  onClearImage: handleClearImage,
  onSelectImage: handleSelectImage,
  onToggleImageAssetPickerModal: handleToggleImageAssetPickerModal,
}) => (
  <div className="modal-body-blocksmith">
    <AudioBlockPreview
      className="mb-4"
      block={block}
    />
    <FormGroup>
      <ImageAssetPicker
        isDisabled={false}
        isImageSelected={isImageSelected}
        isModalOpen={isImageAssetPickerModalOpen}
        label="Select A Audio Block Poster Image"
        multiAssetErrorMessage="Invalid Action: Trying to assign multiple Article Block Poster images."
        node={node}
        onClearImage={handleClearImage}
        onSelectImage={handleSelectImage}
        onToggleImageAssetPickerModal={handleToggleImageAssetPickerModal}
      />
    </FormGroup>
    <FormGroup inline className="d-flex justify-content-center form-group-mobile px-3 mb-2">
      <FormGroup>
        <Label className="d-flex justify-content-center text-nowrap align-items-center mb-0">
          Launch Text
          <Input size="sm" className="ml-2 w-auto" value={launchText} onChange={handleChangeLaunchText} />
        </Label>
      </FormGroup>
      <FormGroup className="ml-4">
        <Checkbox size="sd" id="aside" checked={aside} onChange={handleChangeCheckbox} className="ml-3">
          Aside
        </Checkbox>
        <Icon imgSrc="info-outline" id="aside-tooltip" size="xs" className="ml-1" />
        <UncontrolledTooltip target="aside-tooltip">Is only indirectly related to the main content.</UncontrolledTooltip>
      </FormGroup>
    </FormGroup>
  </div>
);

CustomizeOptions.propTypes = {
  aside: PropTypes.bool.isRequired,
  block: PropTypes.instanceOf(Message).isRequired,
  hasUpdatedDate: PropTypes.bool.isRequired,
  isImageAssetPickerModalOpen: PropTypes.bool.isRequired,
  isImageSelected: PropTypes.bool.isRequired,
  launchText: PropTypes.string.isRequired,
  node: PropTypes.instanceOf(Message).isRequired,
  onChangeCheckBox: PropTypes.func.isRequired,
  onChangeLaunchText: PropTypes.func.isRequired,
  onClearImage: PropTypes.func.isRequired,
  onSelectImage: PropTypes.func.isRequired,
  onToggleImageAssetPickerModal: PropTypes.func.isRequired,
};

export default CustomizeOptions;
