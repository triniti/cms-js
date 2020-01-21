import PropTypes from 'prop-types';
import React from 'react';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import ImageAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/image-asset/ImageAssetV1Mixin';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { Button, FormGroup, FormText, Label } from '@triniti/admin-ui-plugin/components';
import ImageAssetPickerModal from '@triniti/cms/plugins/dam/components/image-asset-picker-modal';

const imageType = ImageAssetV1Mixin.findOne().getCurie().getMessage();

class ImageAssetPickerField extends React.Component {
  static propTypes = {
    areLinkedImagesAllowed: PropTypes.bool,
    input: PropTypes.shape({
      onChange: PropTypes.func,
      value: PropTypes.oneOfType([
        PropTypes.instanceOf(NodeRef),
        PropTypes.string,
      ]),
    }).isRequired,
    isEditMode: PropTypes.bool,
    label: PropTypes.string,
    meta: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    node: PropTypes.instanceOf(Message),
  };

  static defaultProps = {
    areLinkedImagesAllowed: true,
    isEditMode: true,
    label: '',
    node: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
    this.handleToggleModal = this.handleToggleModal.bind(this);
    this.handleSelectImage = this.handleSelectImage.bind(this);
    this.handleCloseUploader = this.handleCloseUploader.bind(this);
    this.handleSetImage = this.handleSetImage.bind(this);
  }

  handleToggleModal() {
    const { isModalOpen } = this.state;
    this.setState({
      isModalOpen: !isModalOpen,
    });
  }

  handleSetImage(image) {
    const { input } = this.props;
    input.onChange(NodeRef.fromNode(image).toString());
  }

  handleSelectImage(image) {
    this.handleSetImage(image);
    this.handleToggleModal();
  }

  handleCloseUploader(image, toggleAllModals) {
    if (image) {
      this.handleSetImage(image);
    }
    if (toggleAllModals) {
      this.handleToggleModal();
    }
  }

  render() {
    const { isModalOpen } = this.state;
    const {
      areLinkedImagesAllowed,
      input: { onChange, value },
      isEditMode,
      label,
      meta: { error },
      node,
    } = this.props;

    return (
      <div className="mb-4">
        <FormGroup className="mb-0">
          <Label>{label}</Label>
          {
            value && (
              <img
                alt={label}
                className="mb-2"
                src={damUrl(NodeRef.fromString(value), 'o', 'sm')}
                style={{ display: 'flex', maxWidth: '100%' }}
              />
            )
          }
        </FormGroup>
        {
          isEditMode && (
            <Button
              disabled={!isEditMode}
              onClick={this.handleToggleModal}
            >
              {`Select a${value ? ' new' : 'n'} Image`}
            </Button>
          )
        }
        {
          isEditMode && error && (
            <FormText key="error" color="danger" className="ml-1">{error}</FormText>
          )
        }
        {
          value && isEditMode
          && <Button onClick={onChange}>Clear Image</Button>
        }
        <ImageAssetPickerModal
          areLinkedImagesAllowed={areLinkedImagesAllowed}
          assetTypes={[imageType]}
          isOpen={isModalOpen}
          node={node}
          onCloseUploader={this.handleCloseUploader}
          onSelectImage={this.handleSelectImage}
          onToggleModal={this.handleToggleModal}
        />
      </div>
    );
  }
}
export default ImageAssetPickerField;
