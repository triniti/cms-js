import AspectRatioEnum from '@triniti/schemas/triniti/common/enums/AspectRatio';
import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import DocumentBlockPreview from '@triniti/cms/plugins/blocksmith/components/document-block-preview';
import humanizeEnums from '@triniti/cms/utils/humanizeEnums';
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
  Select,
} from '@triniti/admin-ui-plugin/components';

const aspectRatioOptions = humanizeEnums(AspectRatioEnum, {
  format: 'map',
  shouldStartCase: false,
  except: [AspectRatioEnum.UNKNOWN],
});

const CustomizeOptions = ({
  aside,
  aspectRatio,
  block,
  hasUpdatedDate,
  isImageAssetPickerModalOpen,
  isImageSelected,
  launchText,
  node,
  onChangeAspectRatio: handleChangeAspectRatio,
  onChangeCheckBox: handleChangeCheckbox,
  onChangeDate: handleChangeDate,
  onChangeLaunchText: handleChangeLaunchText,
  onChangeTime: handleChangeTime,
  onClearImage: handleClearImage,
  onSelectImage: handleSelectImage,
  onToggleImageAssetPickerModal: handleToggleImageAssetPickerModal,
  updatedDate,
}) => (
  <div className="modal-body-blocksmith">
    <DocumentBlockPreview
      className="mt-4 mb-4"
      block={block}
    />
    <FormGroup>
      <ImageAssetPicker
        isDisabled={false}
        isImageSelected={isImageSelected}
        isModalOpen={isImageAssetPickerModalOpen}
        label="Select A Document Block Poster Image"
        multiAssetErrorMessage="Invalid Action: Trying to assign multiple Article Block Poster images."
        node={node}
        onClearImage={handleClearImage}
        onSelectImage={handleSelectImage}
        onToggleImageAssetPickerModal={handleToggleImageAssetPickerModal}
      />
    </FormGroup>
    <div style={{ maxWidth: '350px', margin: '0 auto' }}>
      <FormGroup>
        <Label>Aspect Ratio</Label>
        <Select
          onChange={handleChangeAspectRatio}
          value={!aspectRatio.value ? null : {
            label: aspectRatio.value.replace('by', ' by '),
            value: aspectRatio.value,
          }}
          options={aspectRatioOptions}
        />
      </FormGroup>
    </div>
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
  aspectRatio: PropTypes.instanceOf(AspectRatioEnum).isRequired,
  block: PropTypes.instanceOf(Message).isRequired,
  hasUpdatedDate: PropTypes.bool.isRequired,
  isImageAssetPickerModalOpen: PropTypes.bool.isRequired,
  isImageSelected: PropTypes.bool.isRequired,
  launchText: PropTypes.string.isRequired,
  node: PropTypes.instanceOf(Message).isRequired,
  onChangeAspectRatio: PropTypes.func.isRequired,
  onChangeCheckBox: PropTypes.func.isRequired,
  onChangeDate: PropTypes.func.isRequired,
  onChangeLaunchText: PropTypes.func.isRequired,
  onChangeTime: PropTypes.func.isRequired,
  onClearImage: PropTypes.func.isRequired,
  onSelectImage: PropTypes.func.isRequired,
  onToggleImageAssetPickerModal: PropTypes.func.isRequired,
  updatedDate: PropTypes.instanceOf(Date).isRequired,
};

export default CustomizeOptions;
