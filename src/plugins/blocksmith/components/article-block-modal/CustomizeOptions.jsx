import ArticleBlockPreview from '@triniti/cms/plugins/blocksmith/components/article-block-preview';
import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import ImageAssetPicker from '@triniti/cms/plugins/dam/components/image-asset-picker';
import Message from '@gdbots/pbj/Message';
import moment from 'moment';
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
  block,
  hasUpdatedDate,
  isAssetPickerModalOpen,
  isImageSelected,
  linkText,
  node,
  onChangeCheckBox: handleChangeCheckbox,
  onChangeDate: handleChangeDate,
  onChangeLinkText: handleChangeLinkText,
  onChangeTime: handleChangeTime,
  onClearImage: handleClearImage,
  onSelectImage: handleSelectImage,
  onToggleAssetPickerModal: handleToggleAssetPickerModal,
  showImage,
  updatedDate,
  aside,
}) => (
  <div className="modal-body-blocksmith">
    <ArticleBlockPreview
      className="mb-3"
      block={block}
    />
    {
        showImage
        && (
          <FormGroup>
            <ImageAssetPicker
              multiAssetErrorMessage="Invalid Action: Trying to assign multiple Article Block Poster images."
              isImageSelected={isImageSelected}
              isModalOpen={isAssetPickerModalOpen}
              isDisabled={false}
              label="Select A Article Block Poster Image"
              node={node}
              onClearImage={handleClearImage}
              onSelectImage={handleSelectImage}
              onToggleAssetPickerModal={handleToggleAssetPickerModal}
            />
          </FormGroup>
        )
      }
    <FormGroup inline className="d-flex justify-content-center form-group-mobile px-3 mb-2">
      <FormGroup>
        <Label className="d-flex justify-content-center text-nowrap align-items-center mb-0">
          Link Text
          <Input size="sm" className="ml-2 mr-3 w-auto" value={linkText} onChange={handleChangeLinkText} />
        </Label>
      </FormGroup>
      <FormGroup className="mr-4">
        <Checkbox size="sd" id="showImage" checked={showImage} onChange={handleChangeCheckbox}>
          Show Image
        </Checkbox>
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
  block: PropTypes.instanceOf(Message).isRequired,
  hasUpdatedDate: PropTypes.bool.isRequired,
  isAssetPickerModalOpen: PropTypes.bool.isRequired,
  isImageSelected: PropTypes.bool.isRequired,
  linkText: PropTypes.string.isRequired,
  node: PropTypes.instanceOf(Message).isRequired,
  onChangeCheckBox: PropTypes.func.isRequired,
  onChangeDate: PropTypes.func.isRequired,
  onChangeLinkText: PropTypes.func.isRequired,
  onChangeTime: PropTypes.func.isRequired,
  onClearImage: PropTypes.func.isRequired,
  onSelectImage: PropTypes.func.isRequired,
  onToggleAssetPickerModal: PropTypes.func.isRequired,
  showImage: PropTypes.bool.isRequired,
  updatedDate: PropTypes.instanceOf(moment).isRequired,
};

export default CustomizeOptions;
