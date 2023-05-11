import React from 'react';
import { FormGroup, Input, Label, UncontrolledTooltip } from 'reactstrap';
import { Icon, TextField, SwitchField } from 'components';
import DateTimePicker from 'components/blocksmith-field/components/date-time-picker';
import humanizeEnums from 'components/blocksmith-field/utils/humanizeEnums';
import ImagePickerField from 'plugins/dam/components/image-picker-field';
import ReactSelect from 'react-select';
import ImageBlockPreview from 'components/blocksmith-field/components/image-block-preview';
import PicklistField from 'plugins/sys/components/picklist-field';
import AspectRatio from '@triniti/schemas/triniti/common/enums/AspectRatio';
import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';
import useNode from 'plugins/ncr/components/useNode';

const aspectRatioOptions = humanizeEnums(AspectRatio, {
  format: 'map',
  shouldStartCase: false,
  except: [AspectRatio.UNKNOWN],
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
  imageRef,
  isLink,
  isNsfw,
  isValid,
  launchText = null,
  onChangeUrl: handleChangeUrl,
  onClearImage: handleClearImage,
  onUploadedImage: handleUploadedImage,
  onToggleImageAssetPickerModal: handleToggleImageAssetPickerModal,
  setIsNsfw,
  setAside,
  setAspectRatio,
  setCaption,
  setHasCaption,
  setHasUpdatedDate,
  setIsLink,
  setLaunchText,
  setSelectedImage,
  setTheme,
  // selectedImage = null,
  setUpdatedDate,
  theme = null,
  updatedDate,
  url,
}) => {
  const { node: selectedImage, pbjxError } = useNode(imageRef);

  return (
    <div className="modal-body-blocksmith">
      {/* <ImageBlockPreview className="my-4" block={block} /> */}
      {hasCaption && (block.has('caption') || (selectedImage && selectedImage.has('description'))) && (
        <p>Caption: {block.get('caption') || (selectedImage &&selectedImage.get('description'))}</p>
      )}
      <div style={{ maxWidth: '350px', margin: '0 auto' }}>
        <ImagePickerField
          label="Image"
          name="image_ref"
          nodeRef={imageRef}
          onSelectImage={setSelectedImage}
          selectedImageRef={imageRef}
          aspectRatio={aspectRatio}
          launchText={launchText}
          onUploadedImageComplete={handleUploadedImage}
          />
        <FormGroup>
          <Label>Aspect Ratio</Label>
          <ReactSelect
            name="aspect_ratio"
            className="select"
            classNamePrefix="select"
            isMulti={false}
            options={aspectRatioOptions}
            value={aspectRatio ? aspectRatioOptions.find(o => o.value === aspectRatio.value) : null}
            defaultValue={aspectRatioOptions[0]}
            isSelected={!!aspectRatio}
            onChange={selected => { setAspectRatio(selected ? AspectRatio.create(selected.value) : null)}}
          />
        </FormGroup>

        {block.schema().hasMixin('triniti:common:mixin:themeable')
        && (
          <PicklistField
            name="theme"
            label="Theme"
            picklist="image-block-themes"
            onChange={selectedOption => setTheme(selectedOption ? selectedOption.value : null)}
            value={theme ? { label: theme, value: theme } : {}}
          />
        )}
        <TextField
          name="launch_text"
          label="Launch Text"
          value={launchText}
          onChange={(e) => setLaunchText(e.target.value)}
        />
        <SwitchField
          name="isNsfw"
          label="Is NSFW"
          checked={isNsfw}
          onChange={(e) => setIsNsfw(e.target.checked)}
          />
        <FormGroup className="d-flex align-items-start mb-2">
          <SwitchField
            name="hasCaption"
            label="Caption"
            checked={hasCaption}
            onChange={(e) => setHasCaption(e.target.checked)}
            />
          {hasCaption && (
            <TextField
              name="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter a caption..."
              />
          )}
        </FormGroup>
        <FormGroup className="d-flex align-items-start mb-2">
          <SwitchField
            name="isLink"
            label="Is Link"
            checked={isLink}
            onChange={(e) => setIsLink(e.target.checked)}
            />
          {isLink && (
            <FormGroup className="mb-0">
              <TextField
                name="url"
                value={url}
                onChange={handleChangeUrl}
                placeholder="https://example.com"
                />
              {!isValid && (
                <p className="text-danger mb-0 mt-1 mx-2">please enter a valid link</p>
              )}
            </FormGroup>
          )}
        </FormGroup>
        <FormGroup className="mb-4">
          <SwitchField
            name="hasUpdatedDate"
            label="Is Update"
            checked={hasUpdatedDate}
            onChange={(e) => setHasUpdatedDate(e.target.checked)}
            />
          {hasUpdatedDate
            && (
              <DateTimePicker
                onChangeDate={date => setUpdatedDate(changedDate(date).updatedDate)}
                onChangeTime={({ target: { value: time } }) => setUpdatedDate(changedTime(time).updatedDate)}
                updatedDate={updatedDate}
              />
            )}
        </FormGroup>
        <div className="form-group d-flex align-items-center mb-0">
          <SwitchField
            name="aside"
            label="Aside"
            checked={aside}
            onChange={(e) => setAside(e.target.checked)}
            style={{display: 'flex', justifyContent: 'space-between'}}
            />
          <Icon imgSrc="info-outline" id="aside-tooltip" className="ms-1 align-self-start" />
          <UncontrolledTooltip target="aside-tooltip" placement="right">Is only indirectly related to the main content.</UncontrolledTooltip>
        </div>
      </div>
    </div>
  );
}

export default CustomizeOptions;