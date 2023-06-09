import { connect } from 'react-redux';
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

import getYoutubePlaylistIds from './getYoutubePlaylistIds';
import selector from './selector';

class YoutubePlaylistBlockModal extends React.Component {
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
      autoplay: block.get('autoplay'),
      errorMsg: '',
      hasUpdatedDate: block.has('updated_date'),
      isImageAssetPickerModalOpen: false,
      isValid: block.has('playlist_id'),
      playlistId: block.get('playlist_id'),
      selectedImageNode: imageNode || null,
      touched: false,
      videoId: block.get('video_id', null),
    };
    this.buttonRef = React.createRef();
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeTextarea = this.handleChangeTextarea.bind(this);
    this.handleClearImage = this.handleClearImage.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
    this.handleSelectImage = this.handleSelectImage.bind(this);
    this.handleToggleImageAssetPickerModal = this.handleToggleImageAssetPickerModal.bind(this);
    this.inputElementRef = React.createRef();
    this.refocusModal = this.refocusModal.bind(this);
  }

  componentDidMount() {
    this.inputElementRef.current.focus();
  }

  setBlock() {
    const {
      aside,
      autoplay,
      selectedImageNode, playlistId, videoId } = this.state;
    const { block } = this.props;
    const setBlock = block.schema().createMessage()
      .set('aside', aside)
      .set('autoplay', autoplay)
      .set('playlist_id', playlistId)
      .set('poster_image_ref', selectedImageNode ? NodeRef.fromNode(selectedImageNode) : null);
    if (videoId) {
      setBlock.set('video_id', videoId);
    }
    return setBlock;
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

  handleChangeCheckbox({ target: { checked, id } }) {
    this.setState({ [id]: checked });
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
      playlistId,
      autoplay,
      isValid,
      touched,
    } = this.state;
    const { isFreshBlock, isOpen, node, toggle } = this.props;
    const { isImageAssetPickerModalOpen, selectedImageNode } = this.state;

    return (
      <Modal isOpen={isOpen} toggle={toggle} autoFocus={false} keyboard={!isImageAssetPickerModalOpen}>
        <ModalHeader toggle={toggle}>{`${isFreshBlock ? 'Add' : 'Update'}  Youtube Playlist Block`}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>{isValid ? 'Youtube Playlist Id' : 'Youtube Playlist Embed Code, URL, or ID'}</Label>
            <Input
              innerRef={this.inputElementRef}
              onChange={this.handleChangeTextarea}
              placeholder="enter embed code, url, or id"
              type="textarea"
              value={playlistId || null}
            />
          </FormGroup>
          {
            !isValid && touched
            && <p className="text-danger">{errorMsg}</p>
          }
          {isValid && <YoutubePlaylistBlockPreview block={this.setBlock()} width={526} />}
          <FormGroup className="mt-3">
            <ImageAssetPicker
              isDisabled={!isValid}
              isImageSelected={!!selectedImageNode}
              isModalOpen={isImageAssetPickerModalOpen}
              label="Select A Youtube Playlist Block Poster Image"
              multiAssetErrorMessage="Invalid Action: Trying to assign multiple Youtube Playlist Block Poster images."
              node={node}
              onClearImage={this.handleClearImage}
              onSelectImage={this.handleSelectImage}
              onToggleImageAssetPickerModal={this.handleToggleImageAssetPickerModal}
            />
          </FormGroup>
          <FormGroup check>
            <Checkbox size="sd" id="autoplay" checked={autoplay} disabled={!!selectedImageNode} onChange={this.handleChangeCheckbox}>
              Autoplay
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
            onClick={isFreshBlock ? this.handleAddBlock : this.handleEditBlock}
          >
            {isFreshBlock ? 'Add' : 'Update'}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default connect(selector)(YoutubePlaylistBlockModal);
