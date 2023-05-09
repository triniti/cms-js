import React from 'react';
import { FormGroup, Input, Label, UncontrolledTooltip } from 'reactstrap';
import { Icon } from 'components';
import AspectRatioEnum from '@triniti/schemas/triniti/common/enums/AspectRatio';
import DateTimePicker from 'components/blocksmith-field/components/date-time-picker';
import humanizeEnums from 'components/blocksmith-field/utils/humanizeEnums';
import ImagePickerField from 'plugins/dam/components/image-picker-field';
import ImageBlockPreview from 'components/blocksmith-field/components/image-block-preview';
import PicklistField from 'plugins/sys/components/picklist-field';

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
  launchText = null,
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
  selectedImage = null,
  theme = null,
  updatedDate,
  url,
}) => (
  <div className="modal-body-blocksmith">
    <ImageBlockPreview className="my-4" block={block} />
    {hasCaption && (block.has('caption') || selectedImage.has('description')) && (
      <p>Caption: {block.get('caption') || selectedImage.get('description')}</p>
    )}
    <FormGroup>
      <ImagePickerField
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
        <Input
          type="select"
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
        <PicklistField
          name="theme"
          label="Theme"
          picklist="image-block-themes"
          onChange={handleChangeTheme}
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
            <Input type="checkbox" size="sd" id="isNsfw" checked={isNsfw} onChange={handleChangeCheckbox} />
            is nsfw
          </Label>
        </FormGroup>
      </FormGroup>
      <FormGroup className="d-flex align-items-start mb-2">
        <FormGroup check className="mr-2 pb-1">
          <Label check>
            <Input type="checkbox" size="sd" id="hasCaption" checked={hasCaption} onChange={handleChangeCheckbox} />
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
            <Input type="checkbox" size="sd" id="isLink" checked={isLink} onChange={handleChangeCheckbox} placeholder="Enter a link..." />
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
            <Input type="checkbox" size="sd" id="hasUpdatedDate" checked={hasUpdatedDate} onChange={handleChangeCheckbox} />
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
            <Input type="checkbox" size="sd" id="aside" checked={aside} onChange={handleChangeCheckbox} />
            Aside
          </Label>
          <Icon imgSrc="info-outline" id="aside-tooltip" size="xs" className="ml-1" />
          <UncontrolledTooltip target="aside-tooltip">Is only indirectly related to the main content.</UncontrolledTooltip>
        </FormGroup>
      </FormGroup>
    </div>
  </div>
);

export default CustomizeOptions;