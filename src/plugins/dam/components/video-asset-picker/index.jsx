import { Button } from '@triniti/admin-ui-plugin/components';
import Message from '@gdbots/pbj/Message';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React from 'react';
import VideoAssetPickerModal from '@triniti/cms/plugins/dam/components/video-asset-picker-modal';

class VideoAssetPicker extends React.Component {
  static propTypes = {
    isEditMode: PropTypes.bool,
    onClearVideoAsset: PropTypes.func,
    onSelectVideoAsset: PropTypes.func.isRequired,
    onToggleVideoAssetPickerModal: PropTypes.func,
    selectedVideo: PropTypes.instanceOf(Message),
  };

  static defaultProps = {
    isEditMode: false,
    onClearVideoAsset: noop,
    onToggleVideoAssetPickerModal: noop,
    selectedVideo: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isVideoAssetPickerModalOpen: false,
    };

    this.handleToggleVideoAssetPickerModal = this.handleToggleVideoAssetPickerModal.bind(this);
  }

  handleToggleVideoAssetPickerModal(...args) {
    const { onToggleVideoAssetPickerModal } = this.props;
    this.setState(({ isVideoAssetPickerModalOpen }) => ({
      isVideoAssetPickerModalOpen: !isVideoAssetPickerModalOpen,
    }), () => onToggleVideoAssetPickerModal(...args));
  }

  render() {
    const {
      isEditMode,
      onClearVideoAsset: handleClearVideoAsset,
      onSelectVideoAsset: handleSelectVideoAsset,
      selectedVideo,
    } = this.props;
    const { isVideoAssetPickerModalOpen } = this.state;
    return (
      <span>
        <Button
          className="mr-3"
          disabled={!isEditMode}
          onClick={this.handleToggleVideoAssetPickerModal}
        >
          {`Select a${selectedVideo ? ' new' : ''} Video Asset`}
        </Button>
        {selectedVideo && (
        <Button
          onClick={handleClearVideoAsset}
          disabled={!isEditMode}
        >
        Clear Video Asset
        </Button>
        )}
        <VideoAssetPickerModal
          isOpen={isVideoAssetPickerModalOpen}
          onCloseUploader={handleSelectVideoAsset}
          onSelectVideoAsset={handleSelectVideoAsset}
          onToggleModal={this.handleToggleVideoAssetPickerModal}
          selectedVideos={selectedVideo ? [selectedVideo] : []}
        />
      </span>
    );
  }
}

export default VideoAssetPicker;
