import { connect } from 'react-redux';
import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import FacebookVideoBlockPreview from '@triniti/cms/plugins/blocksmith/components/facebook-video-block-preview';
import ImageAssetPicker from '@triniti/cms/plugins/dam/components/image-asset-picker';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PropTypes from 'prop-types';
import React from 'react';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import {
  Button,
  Checkbox,
  FormGroup,
  Icon,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@triniti/admin-ui-plugin/components';

import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';
import selector from './selector';

const FB_VIDEO_REGEX = new RegExp('(?:(?:https?:)?\\/\\/)?(?:www\\.)?facebook\\.com\\/[a-zA-Z0-9\\.]+\\/videos\\/(?:[a-z0-9\\.]+\\/)?([0-9]+)\\/?(?:\\?.*)?');
const FB_VIDEO_AUTOPLAY_ATTR_REGEX = new RegExp('data-autoplay=".+?"');
const FB_VIDEO_SHOW_CAPTIONS_ATTR_REGEX = new RegExp('data-show-captions=".+?"');
const FB_VIDEO_SHOW_TEXT_ATTR_REGEX = new RegExp('data-show-text=".+?"');
const FB_VIDEO_SHOW_TEXT_QUERY_STRING_REGEX = new RegExp('show_text=.');
// i could not find examples of query strings for autoplay or show_captions.
// maybe they follow the same pattern, i dunno.

class FacebookVideoBlockModal extends React.Component {
  static propTypes = {
    blockKey: PropTypes.string.isRequired,
    block: PropTypes.instanceOf(Message).isRequired,
    imageNode: PropTypes.instanceOf(Message),
    isFreshBlock: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool,
    node: PropTypes.instanceOf(Message),
    toggle: PropTypes.func.isRequired,
    onAddBlock: PropTypes.func.isRequired,
    onEditBlock: PropTypes.func.isRequired,
  };

  static defaultProps = {
    imageNode: null,
    isOpen: false,
    node: null,
  };

  constructor(props) {
    super(props);
    const { block, imageNode } = props;
    this.state = {
      aside: block.get('aside'),
      autoplay: block.get('autoplay'),
      hasUpdatedDate: block.has('updated_date'),
      href: block.get('href'),
      isAssetPickerModalOpen: false,
      isValid: true,
      selectedImageNode: imageNode || null,
      showCaptions: block.get('show_captions'),
      showText: block.get('show_text'),
      updatedDate: block.get('updated_date', new Date()),
    };
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeTextArea = this.handleChangeTextArea.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
    this.handleSelectImage = this.handleSelectImage.bind(this);
    this.handleToggleAssetPickerModal = this.handleToggleAssetPickerModal.bind(this);
    this.handleChangeAside = this.handleChangeAside.bind(this);
    this.handleClearImage = this.handleClearImage.bind(this);
  }

  setBlock() {
    const {
      autoplay,
      aside,
      hasUpdatedDate,
      href,
      selectedImageNode,
      showCaptions,
      showText,
      updatedDate,
    } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('aside', aside)
      .set('autoplay', autoplay)
      .set('href', href)
      .set('poster_image_ref', selectedImageNode ? NodeRef.fromNode(selectedImageNode) : null)
      .set('show_captions', showCaptions)
      .set('show_text', showText)
      .set('updated_date', hasUpdatedDate ? updatedDate : null);
  }

  handleAddBlock() {
    const { onAddBlock, toggle, blockKey } = this.props;
    onAddBlock(this.setBlock(), blockKey);
    toggle();
  }

  handleEditBlock() {
    const { onEditBlock, toggle, blockKey } = this.props;
    onEditBlock(this.setBlock(), blockKey);
    toggle();
  }

  handleChangeTextArea(event) {
    let { autoplay, showCaptions, showText } = this.state;
    const input = decodeURIComponent(event.target.value);
    let href = input;
    let isValid = false;
    if (FB_VIDEO_REGEX.test(input)) {
      isValid = true;
      if (FB_VIDEO_AUTOPLAY_ATTR_REGEX.test(input)) {
        autoplay = input.match(FB_VIDEO_AUTOPLAY_ATTR_REGEX)[0].replace('data-autoplay="', '') === 'true"';
      }
      if (FB_VIDEO_SHOW_CAPTIONS_ATTR_REGEX.test(input)) {
        showCaptions = input.match(FB_VIDEO_SHOW_CAPTIONS_ATTR_REGEX)[0].replace('data-show-captions="', '') === 'true"';
      }
      if (FB_VIDEO_SHOW_TEXT_ATTR_REGEX.test(input)) {
        showText = input.match(FB_VIDEO_SHOW_TEXT_ATTR_REGEX)[0].replace('data-show-text="', '') === 'true"';
      }
      if (FB_VIDEO_SHOW_TEXT_QUERY_STRING_REGEX.test(input)) {
        showText = !!+input.match(FB_VIDEO_SHOW_TEXT_QUERY_STRING_REGEX)[0].replace('show_text=', '');
      }
      href = input.match(FB_VIDEO_REGEX)[0];
    }
    this.setState({
      autoplay,
      href,
      isValid,
      showCaptions,
      showText,
    });
  }

  handleChangeCheckbox({ target: { id, checked } }) {
    this.setState({ [id]: checked });
  }

  handleChangeDate(date) {
    this.setState(changedDate(date));
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(changedTime(time));
  }

  handleToggleAssetPickerModal() {
    this.setState(({ isAssetPickerModalOpen }) => ({
      isAssetPickerModalOpen: !isAssetPickerModalOpen,
    }), () => {
      const { isAssetPickerModalOpen } = this.state;
      if (!isAssetPickerModalOpen) {
        this.refocusModal();
      }
    });
  }

  handleClearImage() {
    this.setState({ selectedImageNode: null }, this.refocusModal);
  }

  handleSelectImage(imageNode) {
    this.setState({
      autoplay: false,
      selectedImageNode: imageNode,
    });
  }

  handleChangeAside() {
    this.setState(({ aside }) => ({ aside: !aside }));
  }

  /**
   * Needs to return the focus to an element else pressing "ESC" to close the modal won't work
   */
  refocusModal() {
    this.button.focus();
  }

  render() {
    const {
      autoplay,
      aside,
      hasUpdatedDate,
      href,
      isAssetPickerModalOpen,
      isValid,
      selectedImageNode,
      showCaptions,
      showText,
      updatedDate,
    } = this.state;

    const { 
      blockKey,
      isOpen, 
      isFreshBlock, 
      node, 
      toggle
    } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle} autoFocus={false} keyboard={!isAssetPickerModalOpen}>
        <ModalHeader toggle={toggle}>{`${isFreshBlock ? 'Add' : 'Update'} Facebook Video Block`}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label className="float-left">URL</Label>
            <Input
              autoFocus
              onChange={this.handleChangeTextArea}
              placeholder="enter url or embed code"
              type="textarea"
              value={href || ''}
            />
          </FormGroup>
          {
            !isValid && href
            && <p className="text-danger">url or embed is invalid</p>
          }
          {isValid && href
            && (
              <FacebookVideoBlockPreview
                block={this.setBlock()}
                width={526}
              />
            )}
          <FormGroup className="mt-3">
            <ImageAssetPicker
              multiAssetErrorMessage="Invalid Action: Trying to assign multiple Facebook Block Poster images."
              isImageSelected={!!selectedImageNode}
              isModalOpen={isAssetPickerModalOpen}
              isDisabled={!isValid || !href}
              label="Select A Facebook Block Poster Image"
              node={node}
              onClearImage={this.handleClearImage}
              onSelectImage={this.handleSelectImage}
              onToggleAssetPickerModal={this.handleToggleAssetPickerModal}
            />
          </FormGroup>
          <FormGroup check>
            <Checkbox size="sd" id="autoplay" checked={autoplay} onChange={this.handleChangeCheckbox} disabled={!!selectedImageNode}>Autoplay</Checkbox>
          </FormGroup>
          <FormGroup check>
            <Checkbox size="sd" id="showCaptions" checked={showCaptions} onChange={this.handleChangeCheckbox}>Show Captions</Checkbox>
          </FormGroup>
          <FormGroup check>
            <Checkbox size="sd" id="showText" checked={showText} onChange={this.handleChangeCheckbox}>Show Text</Checkbox>
          </FormGroup>
          <FormGroup check>
            <Checkbox size="sd" id="hasUpdatedDate" checked={hasUpdatedDate} onChange={this.handleChangeCheckbox}>Is update</Checkbox>
          </FormGroup>
          <FormGroup check>
            <Checkbox size="sd" id="aside" checked={aside} onChange={this.handleChangeCheckbox}>Aside</Checkbox>
            <Icon imgSrc="info-outline" id="aside-tooltip" size="xs" className="ml-1" />
            <UncontrolledTooltip target="aside-tooltip">Is only indirectly related to the main content.</UncontrolledTooltip>
          </FormGroup>
          {hasUpdatedDate
            && (
              <DateTimePicker
                onChangeDate={this.handleChangeDate}
                onChangeTime={this.handleChangeTime}
                updatedDate={updatedDate}
              />
            )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={toggle} innerRef={(el) => { this.button = el; }}>Cancel</Button>
          <Button
            disabled={!isValid}
            onClick={
              isFreshBlock 
              ? () => this.handleAddBlock(this.setBlock(), blockKey) 
              : () => this.handleEditBlock(this.setBlock(), blockKey)
            }
          >
            {isFreshBlock ? 'Add' : 'Update'}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default connect(selector)(FacebookVideoBlockModal);
