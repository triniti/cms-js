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
    this.handleClearVideoAssets = this.handleClearVideoAssets.bind(this);
  }

  handleToggleModal() {
    const { isModalOpen } = this.state;
    this.setState({
      isModalOpen: !isModalOpen,
    });
  }

  handleSelectVideoAsset(nodeRef) {
    const { input } = this.props;
    input.onChange(nodeRef);
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

  handleClearVideoAssets(...args) {
    console.log('here:handleClearVideoAssets', args);
  }

  render() {
    const { isModalOpen } = this.state;
    const {
      getNode,
      input: { onChange, value },
      isEditMode,
      label,
      meta: { error },
      node,
    } = this.props;

    return (
      <VideoAssetPicker
        isEditMode={isEditMode}
        onClearVideoAsset={this.handleClearVideoAssets}
        onSelectVideoAsset={this.handleSelectVideoAsset}
        selectedVideo={value}
      />
    );
  }
}
export default VideoAssetPickerField;
