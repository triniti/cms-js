import { connect } from 'react-redux';
import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import ImageAssetPicker from '@triniti/cms/plugins/dam/components/image-asset-picker';
import Message from '@gdbots/pbj/Message';
import moment from 'moment';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PropTypes from 'prop-types';
import React from 'react';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import YoutubeVideoBlockPreview from '@triniti/cms/plugins/blocksmith/components/youtube-video-block-preview';
import {
  Button,
  Checkbox,
  FormGroup,
  Icon,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@triniti/admin-ui-plugin/components';

import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';
import selector from './selector';

const YOUTUBE_VIDEO_REGEX = /https?:\/\/(www\.)?youtu\.?be(.com)?\/(embed\/|watch\?v=)?[\w\s-]+/;
const YOUTUBE_STRIP_URL_REGEX = /https?:\/\/(www\.)?youtu\.?be(.com)?\/(embed\/|watch\?v=)?/g;
const YOUTUBE_START_AT_REGEX = /\?(t|start)=[\w\d]+/;

class YouTubeVideoBlockModal extends React.Component {
  static propTypes = {
    block: PropTypes.instanceOf(Message).isRequired,
    imageNode: PropTypes.instanceOf(Message),
    isFreshBlock: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool,
    node: PropTypes.instanceOf(Message),
    onAddBlock: PropTypes.func.isRequired,
    onEditBlock: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
  };

  static defaultProps = {
    imageNode: null,
    isOpen: false,
    node: null,
  };

  constructor(props) {
    super(props);

    const { block, imageNode } = props;
    const id = block.get('id');

    this.state = {
      aside: block.get('aside'),
      autoplay: block.get('autoplay'),
      errorMsg: '',
      hasUpdatedDate: block.has('updated_date'),
      id,
      isImageAssetPickerModalOpen: false,
      isValid: true,
      selectedImageNode: imageNode || null,
      startAt: block.get('start_at'),
      touched: false,
      updatedDate: block.get('updated_date', new Date()),
      url: id ? `https://www.youtube.com/watch?v=${id}` : '',
    };

    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeId = this.handleChangeId.bind(this);
    this.handleChangeStartAt = this.handleChangeStartAt.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleClearImage = this.handleClearImage.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSelectImage = this.handleSelectImage.bind(this);
    this.handleToggleImageAssetPickerModal = this.handleToggleImageAssetPickerModal.bind(this);
  }

  setBlock() {
    const {
      aside,
      autoplay,
      hasUpdatedDate,
      id,
      selectedImageNode,
      startAt,
      updatedDate,
    } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('aside', aside)
      .set('autoplay', autoplay)
      .set('id', id || null)
      .set('poster_image_ref', selectedImageNode ? NodeRef.fromNode(selectedImageNode) : null)
      .set('start_at', startAt || null)
      .set('updated_date', hasUpdatedDate ? updatedDate : null);
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

  handleChangeStartAt(event) {
    let startAt = parseInt(event.target.value, 10);
    if (Number.isNaN(startAt)) {
      startAt = 0;
    }
    this.setState({
      startAt,
    });
  }

  handleChangeId(event) {
    let { errorMsg, id, isValid } = this.state;
    const input = event.target.value;
    let startAt = 0;
    let startAtMatch;
    if (!YOUTUBE_VIDEO_REGEX.test(input)) {
      errorMsg = 'url or embed code is invalid';
      isValid = false;
    } else {
      errorMsg = '';
      isValid = true;
      id = input.match(YOUTUBE_VIDEO_REGEX)[0].replace(YOUTUBE_STRIP_URL_REGEX, '');
      if (input.match(YOUTUBE_START_AT_REGEX)) {
        startAtMatch = input.match(YOUTUBE_START_AT_REGEX)[0].replace(/[?(t|start)=]/g, '');
        if (!startAtMatch.match(/[hms]/)) {
          // only seconds in query string
          startAt = +startAtMatch;
        } else {
          // some variation of hms in query string
          const hms = { h: 0, m: 0, s: 0 };
          Object.keys(hms).forEach((key) => {
            if (startAtMatch.indexOf(key) !== -1) {
              hms[key] = +startAtMatch.slice(0, startAtMatch.indexOf(key));
              startAtMatch = startAtMatch.slice(startAtMatch.indexOf(key) + 1, startAtMatch.length);
            }
          });
          startAt = moment(hms).diff(moment().clone().startOf('day'), 'seconds');
        }
      }
    }
    this.setState({
      errorMsg,
      id,
      isValid,
      startAt,
      touched: true,
      url: event.target.value,
    });
  }

  handleKeyPress(event) {
    if (event.charCode === 13 && event.target.value.trim().length) {
      this.handleAddBlock();
    }
  }

  handleToggleImageAssetPickerModal() {
    this.setState(({ isImageAssetPickerModalOpen }) => ({
      isImageAssetPickerModalOpen: !isImageAssetPickerModalOpen,
    }), () => {
      const { isImageAssetPickerModalOpen } = this.state;
      if (!isImageAssetPickerModalOpen) {
        this.refocusModal();
      }
    });
  }

  handleClearImage() {
    this.setState({
      selectedImageNode: null,
    }, this.refocusModal);
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
      aside,
      autoplay,
      errorMsg,
      hasUpdatedDate,
      id,
      isImageAssetPickerModalOpen,
      isValid,
      selectedImageNode,
      startAt,
      touched,
      updatedDate,
      url,
    } = this.state;

    const { isFreshBlock, isOpen, node, toggle } = this.props;
    const displayUrl = isValid && id ? `https://www.youtube.com/watch?v=${id}` : url;

    return (
      <Modal isOpen={isOpen} toggle={toggle} autoFocus={false} keyboard={!isImageAssetPickerModalOpen}>
        <ModalHeader toggle={toggle}>
          {`${isFreshBlock ? 'Add' : 'Update'} YouTube Video Block`}
        </ModalHeader>
        <ModalBody>
          <FormGroup className="text-left">
            <Label>URL</Label>
            <Input
              className="mb-3"
              autoFocus
              onChange={this.handleChangeId}
              placeholder="enter url or embed code"
              type="textarea"
              value={displayUrl}
              onKeyPress={this.handleKeyPress}
            />
            {
              !isValid && touched
              && <p className="text-danger">{errorMsg}</p>
            }
            <Label>Start At ( In Seconds )</Label>
            <Input
              className="mb-3"
              type="textbox"
              placeholder="enter start at"
              value={startAt}
              onChange={this.handleChangeStartAt}
            />
            {
              !!startAt
              && <p>Will start at: {moment.utc(startAt * 1000).format('HH:mm:ss')}</p>
            }
          </FormGroup>
          {isValid && id
            && (
              <YoutubeVideoBlockPreview
                block={this.setBlock()}
                className="mb-3"
                width={526}
              />
            )}
          <FormGroup>
            <ImageAssetPicker
              isDisabled={!isValid || !id}
              isImageSelected={!!selectedImageNode}
              isModalOpen={isImageAssetPickerModalOpen}
              label="Select A YouTube Block Poster Image"
              multiAssetErrorMessage="Invalid Action: Trying to assign multiple YouTube Block Poster images."
              node={node}
              onClearImage={this.handleClearImage}
              onSelectImage={this.handleSelectImage}
              onToggleImageAssetPickerModal={this.handleToggleImageAssetPickerModal}
            />
          </FormGroup>
          <FormGroup>
            <Checkbox size="sd" id="autoplay" checked={autoplay} onChange={this.handleChangeCheckbox} disabled={!!selectedImageNode}>
              Autoplay
            </Checkbox>
          </FormGroup>
          <FormGroup>
            <Checkbox size="sd" id="hasUpdatedDate" checked={hasUpdatedDate} onChange={this.handleChangeCheckbox}>
              Is update
            </Checkbox>
          </FormGroup>
          <FormGroup>
            <Checkbox size="sd" id="aside" checked={aside} onChange={this.handleChangeCheckbox}>
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

export default connect(selector)(YouTubeVideoBlockModal);
