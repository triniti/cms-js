import { Button, FormGroup, Label } from '@triniti/admin-ui-plugin/components';
import { connect } from 'react-redux';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React from 'react';
import ReactPlayer from 'react-player';
import VideoAssetPickerModal from '@triniti/cms/plugins/dam/components/video-asset-picker-modal';
import selector from './selector';
import damUrl from '../../utils/damUrl';

class VideoAssetPicker extends React.Component {
  static propTypes = {
    isEditMode: PropTypes.bool,
    onClear: PropTypes.func,
    onSelect: PropTypes.func.isRequired,
    selected: PropTypes.instanceOf(Message),
  };

  static defaultProps = {
    isEditMode: false,
    onClear: noop,
    selected: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isVideoAssetPickerModalOpen: false,
      videoAssetRefreshFlag: 0, // when this changes it will trigger a new search
    };

    this.handleToggleUploader = this.handleToggleUploader.bind(this);
    this.handleToggleVideoAssetPickerModal = this.handleToggleVideoAssetPickerModal.bind(this);
  }

  handleToggleVideoAssetPickerModal() {
    this.setState(({ isVideoAssetPickerModalOpen }) => ({
      isVideoAssetPickerModalOpen: !isVideoAssetPickerModalOpen,
    }));
  }

  handleToggleUploader(...args) {
    const { onSelect } = this.props;
    if (args && args.length && args[0] instanceof Message) {
      onSelect(NodeRef.fromNode(args[0]));
      this.setState(({ videoAssetRefreshFlag }) => ({
        videoAssetRefreshFlag: +!videoAssetRefreshFlag,
      }));
    }
  }

  render() {
    const {
      isEditMode,
      onClear: handleClearVideoAsset,
      onSelect: handleSelectVideoAsset,
      selected,
    } = this.props;
    const { isVideoAssetPickerModalOpen, videoAssetRefreshFlag } = this.state;
    return (
      <FormGroup>
        <Label>Video Asset</Label>
        {selected && (
        <FormGroup>
          <div style={{ maxWidth: '50%' }}>
            <ReactPlayer url={damUrl(selected)} width="100%" height="auto" controls />
          </div>
        </FormGroup>
        )}
        <FormGroup>
          <span>
            <Button
              className="mr-3"
              disabled={!isEditMode}
              onClick={this.handleToggleVideoAssetPickerModal}
            >
              {`Select a${selected ? ' new' : ''} Video Asset`}
            </Button>
            {selected && (
            <Button
              onClick={handleClearVideoAsset}
              disabled={!isEditMode}
            >
            Clear Video Asset
            </Button>
            )}
            <VideoAssetPickerModal
              isOpen={isVideoAssetPickerModalOpen}
              onSelectVideoAsset={handleSelectVideoAsset}
              onToggleModal={this.handleToggleVideoAssetPickerModal}
              onToggleUploader={this.handleToggleUploader}
              selectedVideos={selected ? [selected] : []}
              videoAssetRefreshFlag={videoAssetRefreshFlag}
            />
          </span>
        </FormGroup>
      </FormGroup>
    );
  }
}

export default connect(selector)(VideoAssetPicker);
