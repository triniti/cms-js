import { connect } from 'react-redux';
import AspectRatioEnum from '@triniti/schemas/triniti/common/enums/AspectRatio';
import isValidUrl from '@gdbots/common/isValidUrl';
import Message from '@gdbots/pbj/Message';
import prependHttp from 'prepend-http';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ScrollableContainer,
} from '@triniti/admin-ui-plugin/components';
import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';
import CustomizeOptions from './CustomizeOptions';
import selector from './selector';

class ImageBlockModal extends React.Component {
  static propTypes = {
    block: PropTypes.instanceOf(Message).isRequired,
    image: PropTypes.instanceOf(Message),
    isFreshBlock: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired,
    node: PropTypes.instanceOf(Message).isRequired,
    onAddBlock: PropTypes.func.isRequired,
    onEditBlock: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
  };

  static defaultProps = {
    image: null,
  };

  constructor(props) {
    super(props);
    const { block, image, isFreshBlock } = props;
    this.state = {
      aside: block.get('aside'),
      aspectRatio: block.get('aspect_ratio') || AspectRatioEnum.create('auto'),
      caption: block.get('caption') || '',
      hasCaption: block.has('caption'),
      hasUpdatedDate: block.has('updated_date'),
      isAssetPickerModalOpen: isFreshBlock,
      isLink: block.has('url'),
      isNsfw: block.get('is_nsfw'),
      isValid: true,
      launchText: block.get('launch_text') || null,
      selectedImage: image || null,
      theme: block.has('theme') ? block.get('theme') : null,
      updatedDate: block.get('updated_date', new Date()),
      url: block.get('url') || '',
    };
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeAspectRatio = this.handleChangeAspectRatio.bind(this);
    this.handleChangeCaption = this.handleChangeCaption.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeLaunchText = this.handleChangeLaunchText.bind(this);
    this.handleChangeTheme = this.handleChangeTheme.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleChangeUrl = this.handleChangeUrl.bind(this);
    this.handleClearImage = this.handleClearImage.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
    this.handleSelectImage = this.handleSelectImage.bind(this);
    this.handleToggleAssetPickerModal = this.handleToggleAssetPickerModal.bind(this);
  }

  setBlock() {
    const {
      aside,
      aspectRatio,
      caption,
      hasCaption,
      hasUpdatedDate,
      isLink,
      isNsfw,
      isValid,
      launchText,
      selectedImage,
      theme,
      updatedDate,
      url,
    } = this.state;
    const { block } = this.props;
    const setBlock = block.schema().createMessage()
      .set('aside', aside)
      .set('aspect_ratio', aspectRatio)
      .set('caption', hasCaption && caption ? caption : null)
      .set('is_nsfw', isNsfw)
      .set('launch_text', launchText || null)
      .set('node_ref', selectedImage ? selectedImage.get('_id').toNodeRef() : null)
      .set('updated_date', hasUpdatedDate ? updatedDate.toDate() : null)
      .set('url', (isLink && url && isValid) ? prependHttp(url, { https: true }) : null);

    if (setBlock.schema().hasMixin('triniti:common:mixin:themeable')) {
      setBlock.set('theme', theme);
    }

    return setBlock;
  }

  handleAddBlock() {
    const { onAddBlock, toggle } = this.props;
    onAddBlock(this.setBlock());
    toggle();
  }

  handleChangeTheme(selectedOption) {
    this.setState({ theme: selectedOption ? selectedOption.value : null });
  }

  handleChangeAspectRatio(option) {
    this.setState({ aspectRatio: option ? AspectRatioEnum.create(option.value) : AspectRatioEnum.create('auto') });
  }

  handleChangeLaunchText({ target: { value: launchText } }) {
    this.setState({ launchText });
  }

  handleChangeCaption({ target: { value: caption } }) {
    this.setState({ caption });
  }

  handleChangeCheckbox({ target: { id, checked } }) {
    this.setState(({ isValid, url }) => ({
      [id]: checked,
      url: (id === 'isLink' && !checked) ? '' : url,
      isValid: (id === 'isLink' && !checked) ? true : isValid,
    }));
  }

  handleChangeDate(date) {
    this.setState(changedDate(date));
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(changedTime(time));
  }

  handleChangeUrl({ target: { value: url } }) {
    this.setState({
      url,
      isValid: isValidUrl(prependHttp(url, { https: true })),
    });
  }

  handleClearImage() {
    this.setState({ selectedImage: null }, this.refocusModal);
  }

  handleEditBlock() {
    const { onEditBlock, toggle } = this.props;
    onEditBlock(this.setBlock());
    toggle();
  }

  handleSelectImage(selectedImage) {
    this.setState({ selectedImage });
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
    this.button.focus();
  }

  render() {
    const {
      aside,
      aspectRatio,
      caption,
      hasCaption,
      hasUpdatedDate,
      isAssetPickerModalOpen,
      isLink,
      isNsfw,
      isValid,
      launchText,
      selectedImage,
      theme,
      updatedDate,
      url,
    } = this.state;
    const { isFreshBlock, isOpen, node, toggle } = this.props;

    return (
      <Modal
        autoFocus={false}
        centered
        isOpen={isOpen}
        toggle={toggle}
        size="xxl"
        keyboard={!isAssetPickerModalOpen}
      >
        <ModalHeader toggle={toggle}>
          <span className="nowrap">{`${isFreshBlock ? 'Add' : 'Update'} Image Block`}</span>
        </ModalHeader>
        <ModalBody className="p-0 bg-gray-400">
          <ScrollableContainer
            style={{ height: 'calc(100vh - 168px)' }}
          >
            <CustomizeOptions
              aside={aside}
              aspectRatio={aspectRatio}
              block={this.setBlock()}
              caption={caption}
              hasCaption={hasCaption}
              hasUpdatedDate={hasUpdatedDate}
              isAssetPickerModalOpen={isAssetPickerModalOpen}
              isLink={isLink}
              isNsfw={isNsfw}
              isValid={isValid}
              launchText={launchText}
              node={node}
              onChangeAspectRatio={this.handleChangeAspectRatio}
              onChangeCaption={this.handleChangeCaption}
              onChangeCheckBox={this.handleChangeCheckbox}
              onChangeDate={this.handleChangeDate}
              onChangeLaunchText={this.handleChangeLaunchText}
              onChangeTheme={this.handleChangeTheme}
              onChangeTime={this.handleChangeTime}
              onChangeUrl={this.handleChangeUrl}
              onClearImage={this.handleClearImage}
              onSelectImage={this.handleSelectImage}
              onToggleAssetPickerModal={this.handleToggleAssetPickerModal}
              selectedImage={selectedImage}
              theme={theme}
              updatedDate={updatedDate}
              url={url}
            />
          </ScrollableContainer>
        </ModalBody>
        <ModalFooter>
          <Button onClick={toggle} innerRef={(el) => { this.button = el; }}>Cancel</Button>
          <Button
            disabled={!isValid || !selectedImage}
            onClick={isFreshBlock ? this.handleAddBlock : this.handleEditBlock}
          >
            {isFreshBlock ? 'Add' : 'Update'}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
export default connect(selector)(ImageBlockModal);
