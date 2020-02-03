import { connect } from 'react-redux';
import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';
import ImageAssetPicker from '@triniti/cms/plugins/dam/components/image-asset-picker';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PropTypes from 'prop-types';
import React from 'react';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import YoutubePlaylistBlockPreview from '@triniti/cms/plugins/blocksmith/components/youtube-playlist-block-preview';
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
import getYoutubePlaylistIds from './getYoutubePlaylistIds';
import selector from './selector';

class YoutubePlaylistBlockModal extends React.Component {
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
      errorMsg: '',
      hasUpdatedDate: block.has('updated_date'),
      isAssetPickerModalOpen: false,
      isValid: block.has('playlist_id'),
      playlistId: block.get('playlist_id'),
      selectedImageNode: imageNode || null,
      touched: false,
      updatedDate: block.get('updated_date', new Date()),
      videoId: block.get('video_id', null),
    };
    this.buttonRef = React.createRef();
    this.inputElementRef = React.createRef();
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeTextarea = this.handleChangeTextarea.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleClearImage = this.handleClearImage.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
    this.handleSelectImage = this.handleSelectImage.bind(this);
    this.handleToggleAssetPickerModal = this.handleToggleAssetPickerModal.bind(this);
    this.refocusModal = this.refocusModal.bind(this);
  }

  componentDidMount() {
    this.inputElementRef.current.focus();
  }

  setBlock() {
    const {
      aside,
      autoplay,
      hasUpdatedDate,
      selectedImageNode, playlistId, updatedDate, videoId } = this.state;
    const { block } = this.props;
    const setBlock = block.schema().createMessage()
      .set('aside', aside)
      .set('autoplay', autoplay)
      .set('playlist_id', playlistId)
      .set('poster_image_ref', selectedImageNode ? NodeRef.fromNode(selectedImageNode) : null)
      .set('updated_date', hasUpdatedDate ? updatedDate : null);
    if (videoId) {
      setBlock.set('video_id', videoId);
    }
    return setBlock;
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

  handleChangeCheckbox({ target: { checked, id } }) {
    this.setState({ [id]: checked });
  }

  handleChangeDate(date) {
    this.setState(changedDate(date));
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(changedTime(time));
  }

  handleChangeTextarea(event) {
    const input = event.target.value;
    const { isValid, playlistId, videoId } = getYoutubePlaylistIds(input);

    this.setState({
      errorMsg: isValid ? '' : 'Embed Code, URL, or Id is invalid.',
      isValid,
      playlistId,
      touched: true,
      videoId,
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

  /**
   * Needs to return the focus to an element else pressing "ESC" to close the modal won't work
   */
  refocusModal() {
    this.buttonRef.current.focus();
  }

  render() {
    const {
      aside,
      errorMsg,
      hasUpdatedDate,
      playlistId,
      autoplay,
      isValid,
      touched,
      updatedDate,
    } = this.state;
    const { isFreshBlock, isOpen, node, toggle, blockKey } = this.props;
    const { isAssetPickerModalOpen, selectedImageNode } = this.state;

    return (
      <Modal isOpen={isOpen} toggle={toggle} autoFocus={false} keyboard={!isAssetPickerModalOpen}>
        <ModalHeader toggle={toggle}>{`${isFreshBlock ? 'Add' : 'Update'}  Youtube Playlist Block`}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>{isValid ? 'Youtube Playlist Id' : 'Youtube Playlist Embed Code, URL, or ID'}</Label>
            <Input
              innerRef={this.inputElementRef}
              onChange={this.handleChangeTextarea}
              placeholder="enter embed code, url, or id"
              type="textarea"
              value={playlistId || ''}
            />
          </FormGroup>
          {
            !isValid && touched
            && <p className="text-danger">{errorMsg}</p>
          }
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
          {isValid && <YoutubePlaylistBlockPreview block={this.setBlock()} width={526} />}
          <FormGroup className="mt-3">
            <ImageAssetPicker
              isDisabled={!isValid}
              isImageSelected={!!selectedImageNode}
              isModalOpen={isAssetPickerModalOpen}
              label="Select A Youtube Playlist Block Poster Image"
              multiAssetErrorMessage="Invalid Action: Trying to assign multiple Youtube Playlist Block Poster images."
              node={node}
              onClearImage={this.handleClearImage}
              onSelectImage={this.handleSelectImage}
              onToggleAssetPickerModal={this.handleToggleAssetPickerModal}
            />
          </FormGroup>
          <FormGroup check>
            <Checkbox size="sd" id="autoplay" checked={autoplay} disabled={!!selectedImageNode} onChange={this.handleChangeCheckbox}>
              Autoplay
            </Checkbox>
          </FormGroup>
          <FormGroup className="mr-4">
            <Checkbox size="sd" id="hasUpdatedDate" checked={hasUpdatedDate} onChange={this.handleChangeCheckbox}>
              Is update
            </Checkbox>
          </FormGroup>
          <FormGroup className="mr-4">
            <Checkbox size="sd" id="aside" checked={aside} onChange={this.handleChangeCheckbox}>
              Aside
            </Checkbox>
            <Icon imgSrc="info-outline" id="aside-tooltip" size="xs" className="ml-1" />
            <UncontrolledTooltip target="aside-tooltip">Is only indirectly related to the main content.</UncontrolledTooltip>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button onClick={toggle} innerRef={this.buttonRef}>Cancel</Button>
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

export default connect(selector)(YoutubePlaylistBlockModal);
