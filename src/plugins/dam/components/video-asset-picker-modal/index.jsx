import Message from '@gdbots/pbj/Message';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React from 'react';
import Uploader from '@triniti/cms/plugins/dam/components/uploader';
import VideoAssetSearch from '@triniti/cms/plugins/dam/components/video-asset-search';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@triniti/admin-ui-plugin/components';

class VideoAssetPickerModal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    onSelectVideoAsset: PropTypes.func.isRequired,
    onToggleModal: PropTypes.func.isRequired,
    onToggleUploader: PropTypes.func,
    selectedVideos: PropTypes.instanceOf(Message),
    videoAssetRefreshFlag: PropTypes.number.isRequired, // when this changes it will trigger a new search
  };

  static defaultProps = {
    isOpen: false,
    onToggleUploader: noop,
    selectedVideos: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      isUploaderOpen: false,
    };
    this.handleToggleUploader = this.handleToggleUploader.bind(this);
  }

  handleToggleUploader(...args) {
    const { onToggleUploader } = this.props;
    this.setState(({ isUploaderOpen }) => ({
      isUploaderOpen: !isUploaderOpen,
    }), () => onToggleUploader(...args));
  }

  render() {
    const {
      isOpen,
      onSelectVideoAsset,
      onToggleModal,
      selectedVideos,
      videoAssetRefreshFlag,
    } = this.props;
    const { isUploaderOpen } = this.state;

    return (
      <div>
        <Modal onOpened={this.handleOpened} centered size="xxl" isOpen={isOpen} toggle={onToggleModal}>
          <ModalHeader toggle={onToggleModal}>
            <span className="nowrap">Select A Video Asset</span>
          </ModalHeader>
          <ModalBody className="p-0">
            <VideoAssetSearch
              onSelectVideoAsset={onSelectVideoAsset}
              selectedVideos={selectedVideos}
              videoAssetRefreshFlag={videoAssetRefreshFlag}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              className="mr-auto"
              color="primary"
              onClick={this.handleToggleUploader}
            >
              Upload
            </Button>
            <Button
              onClick={onToggleModal}
              disabled={!selectedVideos.length}
            >
              Select
            </Button>
          </ModalFooter>
        </Modal>
        {isUploaderOpen && (
        <Uploader
          allowedMimeTypes={['video/x-flv', 'video/mp4', 'video/webm']}
          allowMultiUpload={false}
          isOpen={isUploaderOpen}
          multiAssetErrorMessage="Invalid Action: Trying to upload multiple Video Assets."
          onToggleUploader={this.handleToggleUploader}
        />
        )}
      </div>
    );
  }
}

export default VideoAssetPickerModal;
