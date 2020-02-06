import { Checkbox, FormGroup, Icon, Input, Label, Select } from '@triniti/admin-ui-plugin/components';
import AspectRatioEnum from '@triniti/schemas/triniti/common/enums/AspectRatio';
import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import humanizeEnums from '@triniti/cms/utils/humanizeEnums';
import ImageAssetPicker from '@triniti/cms/plugins/dam/components/image-asset-picker';
import ImageBlockPreview from '@triniti/cms/plugins/blocksmith/components/image-block-preview';
import Message from '@gdbots/pbj/Message';
import PicklistPicker from '@triniti/cms/plugins/sys/components/picklist-picker';
import PropTypes from 'prop-types';
import React from 'react';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';

const aspectRatioOptions = humanizeEnums(AspectRatioEnum, {
  format: 'map',
  shouldStartCase: false,
  except: [AspectRatioEnum.UNKNOWN],
}).map(({ label, value }) => ({
  label,
  value,
}));

const CustomizeOptions = ({
  aside,
  aspectRatio,
  block,
  caption,
  hasCaption,
  hasUpdatedDate,
  isImageAssetPickerModalOpen,
  isLink,
  isNsfw,
  isValid,
  launchText,
  node,
  onChangeAspectRatio: handleChangeAspectRatio,
  onChangeCaption: handleChangeCaption,
  onChangeCheckBox: handleChangeCheckbox,
  onChangeDate: handleChangeDate,
  onChangeLaunchText: handleChangeLaunchText,
  onChangeTheme: handleChangeTheme,
  onChangeTime: handleChangeTime,
  onChangeUrl: handleChangeUrl,
  onClearImage: handleClearImage,
  onSelectImage: handleSelectImage,
  onToggleImageAssetPickerModal: handleToggleImageAssetPickerModal,
  selectedImage,
  theme,
  updatedDate,
  url,
}) => (
  <div className="modal-body-blocksmith">
    <ImageBlockPreview className="my-4" block={block} />
    {hasCaption && (block.has('caption') || selectedImage.has('description')) && (
      <p>Caption: {block.get('caption') || selectedImage.get('description')}</p>
    )}
    <FormGroup>
      <ImageAssetPicker
        isDisabled={false}
        isImageSelected={!!selectedImage}
        isModalOpen={isImageAssetPickerModalOpen}
        label="Select an image"
        multiAssetErrorMessage="Invalid Action: Can only select one image."
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

      {block.schema().hasMixin('triniti:common:mixin:themeable')
      && (
        <PicklistPicker
          isEditMode
          label="Theme"
          name="theme"
          onChange={handleChangeTheme}
          picklistId="image-block-themes"
          value={theme ? { label: theme, value: theme } : {}}
        />
      )}
      <FormGroup>
        <Label className="d-flex text-nowrap align-items-center mb-0">
            Launch Text
          <Input
            size="sm"
            className="ml-2 mr-3 w-auto"
            value={launchText}
            onChange={handleChangeLaunchText}
            placeholder="Enter launch text..."
          />
        </Label>
      </FormGroup>
      <FormGroup className="d-flex mb-2">
        <FormGroup check>
          <Label check>
            <Checkbox size="sd" id="isNsfw" checked={isNsfw} onChange={handleChangeCheckbox} />
            is nsfw
          </Label>
        </FormGroup>
      </FormGroup>
      <FormGroup className="d-flex align-items-start mb-2">
        <FormGroup check className="mr-2 pb-1">
          <Label check>
            <Checkbox size="sd" id="hasCaption" checked={hasCaption} onChange={handleChangeCheckbox} />
            caption
          </Label>
        </FormGroup>
        {hasCaption && (
          <FormGroup className="mb-0">
            <Label className="mb-0">
              <Input size="sm" value={caption} onChange={handleChangeCaption} placeholder="Enter a caption..." />
            </Label>
          </FormGroup>
        )}
      </FormGroup>
      <FormGroup className="d-flex align-items-start mb-2">
        <FormGroup check className="mr-2 pb-1">
          <Label check>
            <Checkbox size="sd" id="isLink" checked={isLink} onChange={handleChangeCheckbox} placeholder="Enter a link..." />
            is link
          </Label>
        </FormGroup>
        {isLink && (
          <FormGroup className="mb-0">
            <Label className="mb-0">
              <Input size="sm" value={url} onChange={handleChangeUrl} />
            </Label>
            {!isValid && (
              <p className="text-danger mb-0 mt-1 mx-2">please enter a valid link</p>
            )}
          </FormGroup>
        )}
      </FormGroup>
      <FormGroup className="mb-4">
        <FormGroup check className="d-flex align-items-center mr-2">
          <Label check>
            <Checkbox size="sd" id="hasUpdatedDate" checked={hasUpdatedDate} onChange={handleChangeCheckbox} />
            Is update
          </Label>
        </FormGroup>
        {hasUpdatedDate
          && (
            <DateTimePicker
              onChangeDate={handleChangeDate}
              onChangeTime={handleChangeTime}
              updatedDate={updatedDate}
            />
          )}
      </FormGroup>
      <FormGroup className="mb-4">
        <FormGroup check className="d-flex align-items-center mr-2">
          <Label check>
            <Checkbox size="sd" id="aside" checked={aside} onChange={handleChangeCheckbox} />
            Aside
          </Label>
          <Icon imgSrc="info-outline" id="aside-tooltip" size="xs" className="ml-1" />
          <UncontrolledTooltip target="aside-tooltip">Is only indirectly related to the main content.</UncontrolledTooltip>
        </FormGroup>
      </FormGroup>
    </div>
  </div>
);

CustomizeOptions.propTypes = {
  aside: PropTypes.bool.isRequired,
  aspectRatio: PropTypes.instanceOf(AspectRatioEnum).isRequired,
  block: PropTypes.instanceOf(Message).isRequired,
  caption: PropTypes.string.isRequired,
  hasCaption: PropTypes.bool.isRequired,
  hasUpdatedDate: PropTypes.bool.isRequired,
  isImageAssetPickerModalOpen: PropTypes.bool.isRequired,
  isLink: PropTypes.bool.isRequired,
  isNsfw: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  launchText: PropTypes.string,
  node: PropTypes.instanceOf(Message).isRequired,
  onChangeAspectRatio: PropTypes.func.isRequired,
  onChangeCaption: PropTypes.func.isRequired,
  onChangeCheckBox: PropTypes.func.isRequired,
  onChangeDate: PropTypes.func.isRequired,
  onChangeLaunchText: PropTypes.func.isRequired,
  onChangeTheme: PropTypes.func.isRequired,
  onChangeTime: PropTypes.func.isRequired,
  onChangeUrl: PropTypes.func.isRequired,
  onClearImage: PropTypes.func.isRequired,
  onSelectImage: PropTypes.func.isRequired,
  onToggleImageAssetPickerModal: PropTypes.func.isRequired,
  selectedImage: PropTypes.instanceOf(Message),
  theme: PropTypes.string,
  updatedDate: PropTypes.instanceOf(Date).isRequired,
  url: PropTypes.string.isRequired,
};

CustomizeOptions.defaultProps = {
  launchText: null,
  selectedImage: null,
  theme: null,
};

export default CustomizeOptions;
