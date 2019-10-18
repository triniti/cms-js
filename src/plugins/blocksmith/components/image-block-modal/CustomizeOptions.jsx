import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import AspectRatioEnum from '@triniti/schemas/triniti/common/enums/AspectRatio';
import humanizeEnums from '@triniti/cms/utils/humanizeEnums';
import ImageAssetPicker from '@triniti/cms/plugins/dam/components/image-asset-picker';
import ImageBlockPreview from '@triniti/cms/plugins/blocksmith/components/image-block-preview';
import Message from '@gdbots/pbj/Message';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import PicklistPickerField from '@triniti/cms/plugins/sys/components/picklist-picker-field';
import {
  Checkbox,
  FormGroup,
  Icon,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Select,
} from '@triniti/admin-ui-plugin/components';

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
  block,
  aspectRatio,
  caption,
  hasCaption,
  hasUpdatedDate,
  isAssetPickerModalOpen,
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
  onChangeTime: handleChangeTime,
  onChangeUrl: handleChangeUrl,
  onClearImage: handleClearImage,
  onSelectImage: handleSelectImage,
  onToggleAssetPickerModal: handleToggleAssetPickerModal,
  selectedImage,
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
          multiAssetErrorMessage="Invalid Action: Can only select one image."
          isImageSelected={!!selectedImage}
          isModalOpen={isAssetPickerModalOpen}
          isDisabled={false}
          label="Select an image"
          node={node}
          onClearImage={handleClearImage}
          onSelectImage={handleSelectImage}
          onToggleAssetPickerModal={handleToggleAssetPickerModal}
        />
      </FormGroup>
      <div className="mt-0 mb-0 mr-auto ml-auto" style={{ maxWidth: '350px' }}>
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

        {node.schema().hasMixin('triniti:common:mixin:themeable')
          && (
            <Field
              component={PicklistPickerField}
              isEditMode
              label="Theme"
              name="theme"
              picklistId="image-block-themes"
            />
          )}

        <FormGroup>
          <Label className="d-flex justify-content-center text-nowrap align-items-center mb-0">
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
          {hasUpdatedDate && (
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
  block: PropTypes.instanceOf(Message).isRequired,
  aspectRatio: PropTypes.instanceOf(AspectRatioEnum).isRequired,
  caption: PropTypes.string.isRequired,
  hasCaption: PropTypes.bool.isRequired,
  hasUpdatedDate: PropTypes.bool.isRequired,
  isAssetPickerModalOpen: PropTypes.bool.isRequired,
  isLink: PropTypes.bool.isRequired,
  isNsfw: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  node: PropTypes.instanceOf(Message).isRequired,
  onChangeAspectRatio: PropTypes.func.isRequired,
  onChangeCaption: PropTypes.func.isRequired,
  onChangeCheckBox: PropTypes.func.isRequired,
  onChangeDate: PropTypes.func.isRequired,
  launchText: PropTypes.string.isRequired,
  onChangeLaunchText: PropTypes.func.isRequired,
  onChangeTime: PropTypes.func.isRequired,
  onChangeUrl: PropTypes.func.isRequired,
  onClearImage: PropTypes.func.isRequired,
  onSelectImage: PropTypes.func.isRequired,
  onToggleAssetPickerModal: PropTypes.func.isRequired,
  selectedImage: PropTypes.instanceOf(Message),
  updatedDate: PropTypes.instanceOf(Date).isRequired,
  url: PropTypes.string.isRequired,
};

CustomizeOptions.defaultProps = {
  selectedImage: null,
};

export default CustomizeOptions;
