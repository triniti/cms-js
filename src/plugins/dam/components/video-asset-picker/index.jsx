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
    selected: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
  };

  static defaultProps = {
    isEditMode: false,
    onClear: noop,
    selected: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      refreshSearchFlag: 0, // when this changes it will trigger a new search
    };

    this.handleToggleModal = this.handleToggleModal.bind(this);
    this.handleToggleUploader = this.handleToggleUploader.bind(this);
  }

  handleToggleModal() {
    this.setState(({ isModalOpen }) => ({ isModalOpen: !isModalOpen }));
  }

  handleToggleUploader(...args) {
    const { onSelect } = this.props;
    if (args && args.length && args[0] instanceof Message) {
      onSelect(NodeRef.fromNode(args[0]));
      this.setState(({ refreshSearchFlag }) => ({ refreshSearchFlag: +!refreshSearchFlag }));
    }
  }

  render() {
    const {
      isEditMode,
      onClear: handleClear,
      onSelect: handleSelect,
      selected,
    } = this.props;
    const { isModalOpen, refreshSearchFlag } = this.state;

    return (
      <FormGroup>
        <Label>Video Asset</Label>
        {selected && !!selected.length && (
        <FormGroup>
          <div style={{ maxWidth: '50%' }}>
            <ReactPlayer url={damUrl(selected[0])} width="100%" height="auto" controls />
          </div>
        </FormGroup>
        )}
        <FormGroup>
          <span>
            <Button
              className="mr-3"
              disabled={!isEditMode}
              onClick={this.handleToggleModal}
            >
              {`Select a${selected && !!selected.length ? ' new' : ''} Video Asset`}
            </Button>
            {selected && !!selected.length && (
            <Button
              onClick={handleClear}
              disabled={!isEditMode}
            >
            Clear Video Asset
            </Button>
            )}
            <VideoAssetPickerModal
              isOpen={isModalOpen}
              onSelect={handleSelect}
              onToggleModal={this.handleToggleModal}
              onToggleUploader={this.handleToggleUploader}
              refreshSearchFlag={refreshSearchFlag}
              selected={selected}
            />
          </span>
        </FormGroup>
      </FormGroup>
    );
  }
}

export default connect(selector)(VideoAssetPicker);
