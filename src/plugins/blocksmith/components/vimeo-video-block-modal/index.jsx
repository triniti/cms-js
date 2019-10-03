import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Message from '@gdbots/pbj/Message';
import he from 'he';
import { Button, Checkbox, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter } from '@triniti/admin-ui-plugin/components';
import VimeoVideoBlockPreview from '@triniti/cms/plugins/blocksmith/components/vimeo-video-block-preview';
import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import ImageAssetPicker from '@triniti/cms/plugins/dam/components/image-asset-picker';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';

import selector from './selector';

const EMBED_REGEX = /https?:\/\/player\.vimeo\.com\/video\/\d+/;
const URL_REGEX = /^https?:\/\/vimeo\.com\/\d+$/;
const AUTOPLAY_QUERY_STRING_REGEX = /(\?|&)autoplay=(true|false|1|0)/;
const LOOP_QUERY_STRING_REGEX = /(\?|&)loop=(true|false|1|0)/;
const BYLINE_QUERY_STRING_REGEX = /(\?|&)byline=(0|false)/;
const TITLE_QUERY_STRING_REGEX = /(\?|&)title=(0|false)/;
const PORTRAIT_QUERY_STRING_REGEX = /(\?|&)portrait=(0|false)/;
const USER_REGEX = /from\s<a\shref="https?:\/\/vimeo\.com\/.+">.+<\/a>\son/;
const snippetRegex = (id) => new RegExp(`<p><a\\shref="https?:\\/\\/vimeo.com\\/${id}">.+<a\\shref="https?:\\/\\/vimeo.com">Vimeo<\\/a>\\.<\\/p>`);
const titleRegex = (id) => new RegExp(`<p><a\\shref="https?:\\/\\/vimeo.com\\/${id}">.+?<\\/a>`);

const findTitle = (input, id) => input.match(titleRegex(id))[0]
  .replace(`<p><a href="https://vimeo.com/${id}">`, '')
  .replace('</a>', '');

const findUserName = (input) => input.match(USER_REGEX)[0]
  .replace(/from\s<a\shref="https?:\/\/vimeo\.com\/.+">/, '')
  .replace('</a> on', '');

const findUserId = (input, id) => input.match(USER_REGEX)[0]
  .replace(/from\s<a\shref="https?:\/\/vimeo\.com\//, '')
  .replace(`">${id}</a> on`, '');

class VimeoVideoBlockModal extends React.Component {
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
    this.state = {
      autoplay: block.get('autoplay'),
      description: block.get('description'),
      errorMsg: '',
      hasUpdatedDate: block.has('updated_date'),
      id: block.get('id'),
      isValid: true,
      selectedImageNode: imageNode || null,
      title: block.get('title'),
      touched: false,
      updatedDate: block.has('updated_date') ? moment(block.get('updated_date')) : moment(),
      userId: block.get('user_id'),
      userName: block.get('user_name'),
      willLoop: block.get('loop'),
      willShowByline: block.get('show_byline'),
      willShowPortrait: block.get('show_portrait'),
      willShowTitle: block.get('show_title'),
      aside: block.get('aside'),
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
      description,
      hasUpdatedDate,
      id,
      selectedImageNode,
      title,
      updatedDate,
      userId,
      userName,
      willLoop,
      willShowByline,
      willShowPortrait,
      willShowTitle,
      aside,
    } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('id', id || null)
      .set('autoplay', autoplay)
      .set('loop', willLoop)
      .set('show_byline', willShowByline)
      .set('show_portrait', willShowPortrait)
      .set('show_title', willShowTitle)
      .set('description', description || null)
      .set('title', title || null)
      .set('user_id', userId || null)
      .set('user_name', userName || null)
      .set('updated_date', hasUpdatedDate ? updatedDate.toDate() : null)
      .set('poster_image_ref', selectedImageNode ? NodeRef.fromNode(selectedImageNode) : null)
      .set('aside', aside);
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

  handleChangeDate(date) {
    this.setState(changedDate(date));
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(changedTime(time));
  }

  handleChangeCheckbox({ target: { id, checked } }) {
    this.setState({ [id]: checked });
  }

  handleChangeTextArea(event) {
    let {
      autoplay,
      errorMsg,
      id,
      isValid,
      willLoop,
      willShowByline,
      willShowPortrait,
      willShowTitle,
    } = this.state;

    let description = '';
    let title = '';
    let userId = '';
    let userName = '';

    const input = event.target.value;
    if (URL_REGEX.test(input)) {
      errorMsg = '';
      id = input.match(URL_REGEX)[0].replace(/https?:\/\/vimeo\.com\//, '');
      autoplay = false;
      isValid = true;
      willLoop = false;
      willShowByline = true;
      willShowTitle = true;
      willShowPortrait = true;
    } else if (EMBED_REGEX.test(input)) {
      errorMsg = '';
      isValid = true;
      id = input.match(EMBED_REGEX)[0].replace(/https?:\/\/player\.vimeo\.com\/video\//, '');
      if (AUTOPLAY_QUERY_STRING_REGEX.test(input)) {
        autoplay = !!input.match(AUTOPLAY_QUERY_STRING_REGEX)[0].match(/(true|1)/);
      }
      if (LOOP_QUERY_STRING_REGEX.test(input)) {
        willLoop = !!input.match(LOOP_QUERY_STRING_REGEX)[0].match(/(true|1)/);
      }
      willShowByline = !BYLINE_QUERY_STRING_REGEX.test(input);
      willShowTitle = !TITLE_QUERY_STRING_REGEX.test(input);
      willShowPortrait = !PORTRAIT_QUERY_STRING_REGEX.test(input);
      const numberOfPTags = /<\/p>/g.test(input) ? input.match(/<\/p>/g).length : null;
      switch (numberOfPTags) {
        case 1: // title or description
          if (snippetRegex(id).test(input)) {
            title = findTitle(input, id);
            userName = findUserName(input);
            userId = findUserId(input, userName);
          } else {
            description = input.match(/<p>(.|\n)+<\/p>/)[0]
              .replace(/(?:<br\s\/>\n?)+\s+/g, ' ')
              .replace(/<\/?p>/g, '');
          }
          break;
        case 2: // title and description
          title = findTitle(input, id);
          userName = findUserName(input);
          userId = findUserId(input, userName);
          description = input.split('</p>\n<p>')[1]
            .replace(/(?:<br\s\/>\n?)+\s+/g, ' ')
            .replace('</p>', '');
          break;
        case 0:
        default:
          break;
      }
    } else {
      autoplay = false;
      errorMsg = 'url or embed code is invalid';
      id = input;
      isValid = false;
      willLoop = false;
      willShowByline = false;
      willShowTitle = false;
      willShowPortrait = false;
    }
    description = he.decode(description);
    this.setState({
      autoplay,
      description,
      errorMsg,
      id,
      isValid,
      willLoop,
      title,
      touched: true,
      userId,
      userName,
      willShowByline,
      willShowPortrait,
      willShowTitle,
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
      autoplay,
      errorMsg,
      hasUpdatedDate,
      id,
      isAssetPickerModalOpen,
      isValid,
      selectedImageNode,
      touched,
      updatedDate,
      willLoop,
      willShowByline,
      willShowPortrait,
      willShowTitle,
      aside,
    } = this.state;

    const { isFreshBlock, isOpen, node, toggle } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle} autoFocus={false} keyboard={!isAssetPickerModalOpen}>
        <ModalHeader toggle={toggle}>{`${isFreshBlock ? 'Add' : 'Update'} Vimeo Video Block`}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>{isValid ? 'Track id' : 'URL or embed code'}</Label>
            <Input
              autoFocus
              onChange={this.handleChangeTextArea}
              placeholder="enter url or embed code"
              type="textarea"
              value={id || ''}
            />
          </FormGroup>
          {
            !isValid && touched && id !== ''
            && <p className="text-danger">{errorMsg}</p>
          }
          {
            isValid && id
            && <VimeoVideoBlockPreview block={this.setBlock()} width={526} />
          }
          <FormGroup>
            <ImageAssetPicker
              multiAssetErrorMessage="Invalid Action: Trying to assign multiple Vimeo Block Poster images."
              isImageSelected={!!selectedImageNode}
              isModalOpen={isAssetPickerModalOpen}
              isDisabled={!isValid || !id}
              label="Select A Vimeo Block Poster Image"
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
              checked={willLoop}
              id="willLoop"
              onChange={this.handleChangeCheckbox}
              size="sd"
            >
              Loop
            </Checkbox>
          </FormGroup>
          <FormGroup>
            <Checkbox
              checked={willShowByline}
              id="willShowByline"
              onChange={this.handleChangeCheckbox}
              size="sd"
            >
              Show Byline in Overlay
            </Checkbox>
          </FormGroup>
          <FormGroup>
            <Checkbox
              checked={willShowPortrait}
              id="willShowPortrait"
              onChange={this.handleChangeCheckbox}
              size="sd"
            >
              Show Portrait in Overlay
            </Checkbox>
          </FormGroup>
          <FormGroup>
            <Checkbox
              checked={willShowTitle}
              id="willShowTitle"
              onChange={this.handleChangeCheckbox}
              size="sd"
            >
              Show Title in Overlay
            </Checkbox>
          </FormGroup>
          <FormGroup>
            <Checkbox
              checked={hasUpdatedDate}
              id="hasUpdatedDate"
              onChange={this.handleChangeCheckbox}
              size="sd"
            >
              Is update
            </Checkbox>
          </FormGroup>
          <FormGroup>
            <Checkbox
              checked={aside}
              id="aside"
              onChange={this.handleChangeCheckbox}
              size="sd"
            >
              Aside
            </Checkbox>
          </FormGroup>
          {
            hasUpdatedDate
            && (
              <div className="modal-body-blocksmith">
                <DateTimePicker
                  onChangeDate={this.handleChangeDate}
                  onChangeTime={this.handleChangeTime}
                  updatedDate={updatedDate}
                />
              </div>
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

export default connect(selector)(VimeoVideoBlockModal);
