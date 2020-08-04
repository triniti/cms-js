import { Button, FormGroup, Icon, Label, RouterLink } from '@triniti/admin-ui-plugin/components';
import { connect } from 'react-redux';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import noop from 'lodash/noop';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import PropTypes from 'prop-types';
import React from 'react';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import VideoAssetPickerModal from '@triniti/cms/plugins/dam/components/video-asset-picker-modal';
import selector from './selector';

class VideoAssetPicker extends React.Component {
  static propTypes = {
    isEditMode: PropTypes.bool,
    label: PropTypes.string,
    onClear: PropTypes.func,
    onSelect: PropTypes.func.isRequired,
    selected: PropTypes.instanceOf(Message),
  };

  static defaultProps = {
    isEditMode: false,
    label: 'Video Asset',
    onClear: noop,
    selected: null,
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
      label,
      onClear: handleClear,
      onSelect: handleSelect,
      selected,
    } = this.props;
    const { isModalOpen, refreshSearchFlag } = this.state;

    return (
      <FormGroup>
        <Label>{label}</Label>
        {selected && (
        <>
          <RouterLink to={pbjUrl(selected, 'cms')}>
            <Button id={`view-${selected.get('_id')}`} size="xs" color="hover" radius="circle" className="mb-1 ml-2">
              <Icon imgSrc="eye" alt="view" />
            </Button>
            <UncontrolledTooltip placement="auto" target={`view-${selected.get('_id')}`}>View</UncontrolledTooltip>
          </RouterLink>
          <RouterLink to={`${pbjUrl(selected, 'cms')}/edit`}>
            <Button id={`edit-${selected.get('_id')}`} size="xs" color="hover" radius="circle" className="mb-1 mx-1">
              <Icon imgSrc="pencil" alt="edit" />
            </Button>
            <UncontrolledTooltip placement="auto" target={`edit-${selected.get('_id')}`}>Edit</UncontrolledTooltip>
          </RouterLink>
        </>
        )}
        {selected && <p>{selected.get('title')}</p>}
        <FormGroup>
          <span>
            <Button
              className="mr-3"
              disabled={!isEditMode}
              onClick={this.handleToggleModal}
            >
              {`Select a${selected ? ' new' : ''} Video Asset`}
            </Button>
            {selected && (
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
              selected={[NodeRef.fromNode(selected)]}
            />
          </span>
        </FormGroup>
      </FormGroup>
    );
  }
}

export default connect(selector)(VideoAssetPicker);
