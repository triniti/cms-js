import { Button, FormGroup, FormText, Label } from '@triniti/admin-ui-plugin/components';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PropTypes from 'prop-types';
import React from 'react';
import VideoAssetPicker from '@triniti/cms/plugins/dam/components/video-asset-picker';

class VideoAssetPickerField extends React.Component {
  static propTypes = {
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
    this.handleSelectVideoAsset = this.handleSelectVideoAsset.bind(this);
    this.handleCloseUploader = this.handleCloseUploader.bind(this);
  }

  handleToggleModal() {
    const { isModalOpen } = this.state;
    this.setState({
      isModalOpen: !isModalOpen,
    });
  }

  handleSelectVideoAsset(videoAsset) {
    const { input } = this.props;
    input.onChange(NodeRef.fromNode(videoAsset).toString());
    this.handleToggleModal();
  }

  handleCloseUploader(videoAsset, toggleAllModals) {
    const { input } = this.props;
    if (videoAsset) {
      input.onChange(NodeRef.fromNode(videoAsset).toString());
    }
    if (toggleAllModals) {
      this.handleToggleModal();
    }
  }

  render() {
    const { isModalOpen } = this.state;
    const {
      input: { onChange, value },
      isEditMode,
      label,
      meta: { error },
      node,
    } = this.props;

    return (
      <VideoAssetPicker isDisabled={!isEditMode} />
    );
  }
}
export default VideoAssetPickerField;
