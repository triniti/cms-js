import AspectRatioEnum from '@triniti/schemas/triniti/common/enums/AspectRatio';
import GalleryBlockPreview from '@triniti/cms/plugins/blocksmith/components/gallery-block-preview';
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
  isImageAssetPickerModalOpen,
  isImageSelected,
  launchText,
  node,
  onChangeAspectRatio: handleChangeAspectRatio,
  onChangeCheckBox: handleChangeCheckbox,
  onChangeLaunchText: handleChangeLaunchText,
  onChangeStartAtPoster: handleChangeStartAtPoster,
  onChangeTitle: handleChangeTitle,
  onClearImage: handleClearImage,
  onSelectImage: handleSelectImage,
  onToggleImageAssetPickerModal: handleToggleImageAssetPickerModal,
  selectedGallery,
  selectedImage,
  startsAtPoster,
  title,
}) => (
  <div className="modal-body-blocksmith">
    <GalleryBlockPreview className="mb-3" block={block} />
    <FormGroup>
      <ImageAssetPicker
        galleryNode={selectedGallery}
        isDisabled={false}
        isImageSelected={isImageSelected}
        isModalOpen={isImageAssetPickerModalOpen}
        label="Select A Gallery Block Poster Image"
        multiAssetErrorMessage="Invalid Action: Trying to assign multiple Gallery Block Poster images."
        node={node}
        onClearImage={handleClearImage}
        onSelectImage={handleSelectImage}
        onToggleImageAssetPickerModal={handleToggleImageAssetPickerModal}
        selectedImage={selectedImage}
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
        <Checkbox size="sd" id="aside" checked={aside} onChange={handleChangeCheckbox} className="ml-3">
          Aside
        </Checkbox>
        <Icon imgSrc="info-outline" id="aside-tooltip" size="xs" className="ml-1" />
        <UncontrolledTooltip target="aside-tooltip">Is only indirectly related to the main content.</UncontrolledTooltip>
        <Checkbox
          size="sd"
          checked={startsAtPoster}
          onChange={handleChangeStartAtPoster}
          className="ml-3"
        >
          Start At Poster Image
        </Checkbox>
      </FormGroup>
    </FormGroup>
    <FormGroup inline className="d-flex justify-content-center form-group-mobile px-3 mb-2">
      <FormGroup>
        <Label className="d-flex justify-content-center text-nowrap align-items-center mb-0">
          Custom Title
          <Input size="sm" className="ml-2 mr-3 w-auto" value={title} onChange={handleChangeTitle} />
        </Label>
      </FormGroup>
    </FormGroup>
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
  onChangeLaunchText: PropTypes.func.isRequired,
  onChangeStartAtPoster: PropTypes.func.isRequired,
  onChangeTitle: PropTypes.func.isRequired,
  onClearImage: PropTypes.func.isRequired,
  onSelectImage: PropTypes.func.isRequired,
  onToggleImageAssetPickerModal: PropTypes.func.isRequired,
  selectedGallery: PropTypes.instanceOf(Message).isRequired,
  selectedImage: PropTypes.instanceOf(Message),
  startsAtPoster: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  updatedDate: PropTypes.instanceOf(Date).isRequired,
};

CustomizeOptions.defaultProps = {
  selectedImage: null,
};

export default CustomizeOptions;
