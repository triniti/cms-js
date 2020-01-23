import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
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
    onSelect: PropTypes.func.isRequired,
    onToggleModal: PropTypes.func.isRequired,
    onToggleUploader: PropTypes.func.isRequired,
    refreshSearchFlag: PropTypes.number.isRequired, // on change, triggers new search
    selected: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)).isRequired,
  };

  static defaultProps = {
    isOpen: false,
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
      onSelect: handleSelect,
      onToggleModal: handleToggleModal,
      onToggleUploader: handleToggleUploader,
      selected,
      refreshSearchFlag,
    } = this.props;
    const { isUploaderOpen } = this.state;

    return (
      <div>
        <Modal centered size="xxl" isOpen={isOpen} toggle={handleToggleModal}>
          <ModalHeader toggle={handleToggleModal}>
            <span className="nowrap">Select A Video Asset</span>
          </ModalHeader>
          <ModalBody className="p-0">
            <VideoAssetSearch
              onSelect={handleSelect}
              selected={selected}
              refreshSearchFlag={refreshSearchFlag}
              onToggleUploader={handleToggleUploader}
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
              onClick={handleToggleModal}
              disabled={!selected.length}
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
