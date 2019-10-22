import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import DocumentBlockPreview from '@triniti/cms/plugins/blocksmith/components/document-block-preview';
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
  onChangeLaunchText: handleChangeLaunchText,
  onChangeTime: handleChangeTime,
  onClearImage: handleClearImage,
  onSelectImage: handleSelectImage,
  onToggleAssetPickerModal: handleToggleAssetPickerModal,
  updatedDate,
}) => (
  <div className="modal-body-blocksmith">
    <DocumentBlockPreview
      className="mt-4 mb-4"
      block={block}
    />
    <FormGroup>
      <ImageAssetPicker
        multiAssetErrorMessage="Invalid Action: Trying to assign multiple Article Block Poster images."
        isImageSelected={isImageSelected}
        isModalOpen={isAssetPickerModalOpen}
        isDisabled={false}
        label="Select A Document Block Poster Image"
        node={node}
        onClearImage={handleClearImage}
        onSelectImage={handleSelectImage}
        onToggleAssetPickerModal={handleToggleAssetPickerModal}
      />
    </FormGroup>
    <FormGroup inline className="d-flex justify-content-center form-group-mobile mb-4">
      <Label>
        Launch Text
        <Input size="sm" className="ml-2 w-auto" value={launchText} onChange={handleChangeLaunchText} />
      </Label>
    </FormGroup>
    <FormGroup className="mr-4">
      <Checkbox size="sd" id="hasUpdatedDate" checked={hasUpdatedDate} onChange={handleChangeCheckbox}>
        Is update
      </Checkbox>
    </FormGroup>
    <FormGroup className="mr-4">
      <Checkbox size="sd" id="aside" checked={aside} onChange={handleChangeCheckbox}>
        Aside
      </Checkbox>
      <Icon imgSrc="info-outline" id="aside-tooltip" size="xs" className="ml-1" />
      <UncontrolledTooltip target="aside-tooltip">Is only indirectly related to the main content.</UncontrolledTooltip>
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
  onChangeLaunchText: PropTypes.func.isRequired,
  onChangeTime: PropTypes.func.isRequired,
  onClearImage: PropTypes.func.isRequired,
  onSelectImage: PropTypes.func.isRequired,
  onToggleAssetPickerModal: PropTypes.func.isRequired,
  updatedDate: PropTypes.instanceOf(Date).isRequired,
};

export default CustomizeOptions;
