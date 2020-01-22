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
    onCloseUploader: PropTypes.func,
    onSelectVideoAsset: PropTypes.func.isRequired,
    onToggleModal: PropTypes.func.isRequired,
    selectedVideo: PropTypes.instanceOf(Message),
  };

  static defaultProps = {
    isOpen: false,
    onCloseUploader: noop,
    selectedVideo: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isUploaderOpen: false,
    };
    this.handleToggleUploader = this.handleToggleUploader.bind(this);
  }

  handleToggleUploader(...args) {
    this.setState(({ isUploaderOpen }) => ({ isUploaderOpen: !isUploaderOpen }), () => {
      const { isUploaderOpen } = this.state;
      if (!isUploaderOpen) {
        const { onCloseUploader } = this.props;
        onCloseUploader(...args);
      }
    });
  }

  render() {
    const {
      isOpen,
      onToggleModal,
      selectedVideo,
    } = this.props;
    const { isUploaderOpen } = this.state;

    return (
      <div>
        <Modal onOpened={this.handleOpened} centered size="xxl" isOpen={isOpen} toggle={onToggleModal}>
          <ModalHeader toggle={onToggleModal}>
            <span className="nowrap">Select A Video Asset</span>
          </ModalHeader>
          <ModalBody className="p-0">
            <VideoAssetSearch selectedVideo={selectedVideo} />
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
              innerRef={(el) => { this.cancelBtn = el; }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        {isUploaderOpen && (
        <Uploader
          allowMultiUpload={false}
          isOpen={isUploaderOpen}
          multiAssetErrorMessage="Invalid Action: Trying to pick multiple Video Assets."
          onToggleUploader={this.handleToggleUploader}
        />
        )}
      </div>
    );
  }
}

export default VideoAssetPickerModal;
