import { connect } from 'react-redux';
import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import ImageAssetPicker from '@triniti/cms/plugins/dam/components/image-asset-picker';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PropTypes from 'prop-types';
import React from 'react';
import SoundcloudAudioBlockPreview from '@triniti/cms/plugins/blocksmith/components/soundcloud-audio-block-preview';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import {
  Button,
  Checkbox,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Icon,
} from '@triniti/admin-ui-plugin/components';

import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';
import selector from './selector';

const TRACK_ID_REGEX = /api\.soundcloud\.com\/tracks\/\d+/;
const AUTOPLAY_QUERY_STRING_REGEX = /(\?|&)auto_play=(true|false)/;
const HIDE_RELATED_QUERY_STRING_REGEX = /(\?|&)hide_related=(true|false)/;
const SHOW_COMMENTS_QUERY_STRING_REGEX = /(\?|&)show_comments=(true|false)/;
const VISUAL_QUERY_STRING_REGEX = /(\?|&)visual=(true|false)/;

class SoundcloudAudioBlockModal extends React.Component {
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
      aside: block.get('aside'),
      autoplay: block.get('auto_play'),
      errorMsg: '',
      hasUpdatedDate: block.has('updated_date'),
      isValid: block.has('track_id'),
      isVisual: block.get('visual'),
      selectedImageNode: imageNode || null,
      touched: false,
      trackId: block.get('track_id'),
      updatedDate: block.get('updated_date', new Date()),
      willHideRelated: block.get('hide_related'),
      willShowComments: block.get('show_comments'),
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

  componentDidMount() {
    this.inputElement.focus();
  }

  setBlock() {
    const {
      aside,
      autoplay,
      hasUpdatedDate,
      isVisual,
      selectedImageNode,
      trackId,
      updatedDate,
      willHideRelated,
      willShowComments,
    } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('aside', aside)
      .set('auto_play', autoplay)
      .set('hide_related', willHideRelated)
      .set('poster_image_ref', selectedImageNode ? NodeRef.fromNode(selectedImageNode) : null)
      .set('show_comments', willShowComments)
      .set('track_id', trackId || null)
      .set('updated_date', hasUpdatedDate ? updatedDate : null)
      .set('visual', isVisual);
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

  handleChangeCheckbox({ target: { id, checked } }) {
    this.setState({ [id]: checked });
  }

  handleChangeDate(date) {
    this.setState(changedDate(date));
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(changedTime(time));
  }

  handleChangeTextArea(event) {
    let {
      autoplay,
      errorMsg,
      isValid,
      isVisual,
      trackId,
      willHideRelated,
      willShowComments,
    } = this.state;
    const input = event.target.value;
    if (!TRACK_ID_REGEX.test(input)) {
      autoplay = false;
      errorMsg = 'url or embed code is invalid';
      isValid = false;
      trackId = input;
      willHideRelated = false;
      willShowComments = false;
      isVisual = false;
    } else {
      errorMsg = '';
      isValid = true;
      trackId = input.match(TRACK_ID_REGEX)[0].replace('api.soundcloud.com/tracks/', '');
      if (AUTOPLAY_QUERY_STRING_REGEX.test(input)) {
        autoplay = input.match(AUTOPLAY_QUERY_STRING_REGEX)[0].includes('true');
      }
      if (HIDE_RELATED_QUERY_STRING_REGEX.test(input)) {
        willHideRelated = input.match(HIDE_RELATED_QUERY_STRING_REGEX)[0].includes('true');
      }
      if (SHOW_COMMENTS_QUERY_STRING_REGEX.test(input)) {
        willShowComments = input.match(SHOW_COMMENTS_QUERY_STRING_REGEX)[0].includes('true');
      }
      if (VISUAL_QUERY_STRING_REGEX.test(input)) {
        isVisual = input.match(VISUAL_QUERY_STRING_REGEX)[0].includes('true');
      }
    }
    this.setState({
      autoplay,
      errorMsg,
      trackId,
      isValid,
      isVisual,
      touched: true,
      willHideRelated,
      willShowComments,
    });
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

  handleSelectImage(selectedImageNode) {
    this.setState({
      autoplay: false,
      selectedImageNode,
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
      aside,
      autoplay,
      errorMsg,
      hasUpdatedDate,
      isAssetPickerModalOpen,
      isValid,
      isVisual,
      selectedImageNode,
      touched,
      trackId,
      updatedDate,
      willHideRelated,
      willShowComments,
    } = this.state;
    const { isFreshBlock, isOpen, node, toggle } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>{`${isFreshBlock ? 'Add' : 'Update'} Soundcloud Audio Block`}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>{isValid ? 'Track id' : 'Embed code'}</Label>
            <Input
              innerRef={(el) => { this.inputElement = el; }}
              onChange={this.handleChangeTextArea}
              placeholder="enter embed code"
              type="textarea"
              value={trackId || ''}
            />
          </FormGroup>
          {
            !isValid && touched && trackId !== ''
            && <p className="text-danger">{errorMsg}</p>
          }
          {
            isValid && trackId
            && <SoundcloudAudioBlockPreview block={this.setBlock()} width={526} />
          }
          <FormGroup>
            <ImageAssetPicker
              multiAssetErrorMessage="Invalid Action: Trying to assign multiple Soundcloud Block Poster images."
              isImageSelected={!!selectedImageNode}
              isModalOpen={isAssetPickerModalOpen}
              isDisabled={!isValid || !trackId}
              label="Select A Soundcloud Block Poster Image"
              node={node}
              onClearImage={this.handleClearImage}
              onSelectImage={this.handleSelectImage}
              onToggleAssetPickerModal={this.handleToggleAssetPickerModal}
            />
          </FormGroup>
          <FormGroup>
            <Checkbox
              checked={autoplay}
              disabled={!!selectedImageNode}
              id="autoplay"
              onChange={this.handleChangeCheckbox}
              size="sd"
            >
              Autoplay
            </Checkbox>
          </FormGroup>
          <FormGroup>
            <Checkbox
              checked={isVisual}
              id="isVisual"
              onChange={this.handleChangeCheckbox}
              size="sd"
            >
              Visual Overlay
            </Checkbox>
          </FormGroup>
          <FormGroup>
            <Checkbox
              checked={willHideRelated}
              id="willHideRelated"
              onChange={this.handleChangeCheckbox}
              size="sd"
            >
              Hide Related
            </Checkbox>
          </FormGroup>
          <FormGroup>
            <Checkbox
              checked={willShowComments}
              id="willShowComments"
              onChange={this.handleChangeCheckbox}
              size="sd"
            >
              Show Comments
            </Checkbox>
          </FormGroup>
          <FormGroup>
            <Checkbox
              size="sd"
              checked={hasUpdatedDate}
              id="hasUpdatedDate"
              onChange={this.handleChangeCheckbox}
            >
              Is update
            </Checkbox>
          </FormGroup>
          <FormGroup>
            <Checkbox
              size="sd"
              checked={aside}
              id="aside"
              onChange={this.handleChangeCheckbox}
            >
              Aside
            </Checkbox>
            <Icon imgSrc="info-outline" id="aside-tooltip" size="xs" className="ml-1" />
            <UncontrolledTooltip target="aside-tooltip">Is only indirectly related to the main content.</UncontrolledTooltip>
          </FormGroup>
          {hasUpdatedDate
            && (
              <div className="modal-body-blocksmith">
                <DateTimePicker
                  onChangeDate={this.handleChangeDate}
                  onChangeTime={this.handleChangeTime}
                  updatedDate={updatedDate}
                />
              </div>
            )}
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

export default connect(selector)(SoundcloudAudioBlockModal);
