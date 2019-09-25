import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Message from '@gdbots/pbj/Message';
import {
  Button,
  Checkbox,
  DatePicker,
  FormGroup,
  Icon,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@triniti/admin-ui-plugin/components';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import FacebookVideoBlockPreview from '@triniti/cms/plugins/blocksmith/components/facebook-video-block-preview';
import ImageAssetPicker from '@triniti/cms/plugins/dam/components/image-asset-picker';

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
      autoplay: block.get('autoplay'),
      hasUpdatedDate: block.has('updated_date'),
      href: block.get('href'),
      isAssetPickerModalOpen: false,
      isValid: true,
      selectedImageNode: imageNode || null,
      showCaptions: block.get('show_captions'),
      showText: block.get('show_text'),
      updatedDate: block.has('updated_date') ? moment(block.get('updated_date')) : moment(),
    };
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeTextArea = this.handleChangeTextArea.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
    this.handleSelectImage = this.handleSelectImage.bind(this);
    this.handleToggleAssetPickerModal = this.handleToggleAssetPickerModal.bind(this);
    this.handleClearImage = this.handleClearImage.bind(this);
  }

  setBlock() {
    const {
      autoplay,
      hasUpdatedDate,
      href,
      selectedImageNode,
      showCaptions,
      showText,
      updatedDate,
    } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('autoplay', autoplay)
      .set('href', href)
      .set('show_captions', showCaptions)
      .set('show_text', showText)
      .set('updated_date', hasUpdatedDate ? updatedDate.toDate() : null)
      .set('poster_image_ref', selectedImageNode ? NodeRef.fromNode(selectedImageNode) : null);
  }

  handleAddBlock() {
    const { onAddBlock, toggle } = this.props;
    onAddBlock(this.setBlock());
    toggle();
  }

  handleEditBlock() {
    const { onEditBlock, toggle } = this.props;
    onEditBlock(this.setBlock());
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

  /**
   * Needs to return the focus to an element else pressing "ESC" to close the modal won't work
   */
  refocusModal() {
    this.button.focus();
  }

  render() {
    const {
      autoplay,
      hasUpdatedDate,
      href,
      isAssetPickerModalOpen,
      isValid,
      selectedImageNode,
      showCaptions,
      showText,
      updatedDate,
    } = this.state;

    const { isOpen, isFreshBlock, node, toggle } = this.props;
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
          {
            isValid && href
            && (
              <FacebookVideoBlockPreview
                block={this.setBlock()}
                width={526}
              />
            )
          }
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
          {
            hasUpdatedDate
            && (
              <FormGroup>
                <Label>
                  Updated Time: {updatedDate.format('YYYY-MM-DD hh:mm A')}
                </Label>
                <FormGroup className="mb-3 mt-1 shadow-none">
                  <DatePicker
                    onChange={this.handleChangeDate}
                    selected={updatedDate}
                    shouldCloseOnSelect={false}
                    inline
                  />
                  <InputGroup style={{ width: '15rem', margin: 'auto' }}>
                    <InputGroupAddon addonType="prepend" className="text-dark">
                      <InputGroupText>
                        <Icon imgSrc="clock-outline" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="time"
                      onChange={this.handleChangeTime}
                      defaultValue={updatedDate.format('HH:mm')}
                    />
                  </InputGroup>
                </FormGroup>
              </FormGroup>
            )
          }
        </ModalBody>
        <ModalFooter>
          <Button onClick={toggle} innerRef={(el) => { this.button = el; }}>Cancel</Button>
          <Button
            disabled={!isValid}
            onClick={isFreshBlock ? this.handleAddBlock : this.handleEditBlock}
          >
            {isFreshBlock ? 'Add' : 'Update'}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default connect(selector)(FacebookVideoBlockModal);
