import AspectRatioEnum from '@triniti/schemas/triniti/common/enums/AspectRatio';
import isValidUrl from '@gdbots/pbj/utils/isValidUrl';
import prependHttp from 'prepend-http';
import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import { ScrollableContainer } from 'components';
import changedDate from 'components/blocksmith-field/utils/changedDate';
import changedTime from 'components/blocksmith-field/utils/changedTime';
import CustomizeOptions from './CustomizeOptions';

const ImageBlockModal = ({
  image = null,
  block,
  isFreshBlock,
  onAddBlock,
  node,
  toggle
}) => {
  const [ aside, setAside ] = useState(block.get('aside'));
  const [ aspectRatio, setAspectRatio ] = useState(block.get('aspect_ratio', AspectRatioEnum.AUTO));
  const [ caption, setCaption ] = useState(block.get('caption', ''));
  const [ hasCaption, setHasCaption ] = useState(block.has('caption'));
  const [ hasUpdatedDate, setHasUpdatedDate ] = useState(block.has('updated_date'));
  const [ isImageAssetPickerModalOpen, setIsImageAssetPickerModalOpen ] = useState(isFreshBlock);
  const [ isLink, setIsLink ] = useState(block.has('url'));
  const [ isNsfw, setIsNsfw ] = useState(block.get('is_nsfw'));
  const [ isValid, setIsValid ] = useState(true);
  const [ launchText, setLaunchText ] = useState(block.get('launch_text', null));
  const [ selectedImage, setSelectedImage ] = useState(image || null);
  const [ theme, setTheme ] = useState(block.get('theme', null));
  const [ updatedDate, setUpdatedDate ] = useState(block.get('updated_date', new Date()));
  const [ url, setUrl ] = useState(block.get('url', ''));
  
  const setBlock = () => {
    block.schema().createMessage()
      .set('aside', aside)
      .set('aspect_ratio', aspectRatio)
      .set('caption', hasCaption && caption ? caption : null)
      .set('is_nsfw', isNsfw)
      .set('launch_text', launchText || null)
      .set('node_ref', selectedImage ? selectedImage.get('_id').toNodeRef() : null)
      .set('updated_date', hasUpdatedDate ? updatedDate : null)
      .set('url', (isLink && url && isValid) ? prependHttp(url, { https: true }) : null);

    if (setBlock.schema().hasMixin('triniti:common:mixin:themeable')) {
      setBlock.set('theme', theme);
    }

    return setBlock;
  }

  const handleAddBlock = () => {
    onAddBlock(setBlock());
    toggle();
  }

  const handleChangeTheme = (selectedOption) => {
    setTheme(selectedOption ? selectedOption.value : null);
  }

  const handleChangeAspectRatio = (option) => {
    setAspectRatio(AspectRatioEnum.create(option.value));
  }

  const handleChangeLaunchText = ({ target: { value: launchText } }) => {
    setLaunchText(launchText);
  }

  const handleChangeCaption = ({ target: { value: caption } }) => {
    setCaption(caption);
  }

  const handleChangeCheckbox = ({ target: { id, checked } }) => {
    // this.setState(({ isValid, url }) => ({
    //   [id]: checked,
    //   url: (id === 'isLink' && !checked) ? '' : url,
    //   isValid: (id === 'isLink' && !checked) ? true : isValid,
    // }));
    setUrl((id === 'isLink' && !checked) ? '' : url);
    setIsValid((id === 'isLink' && !checked) ? true : isValid);
  }

  const handleChangeDate = (date) => {
    setUpdatedDate(changedDate(date)['updatedDate']);
  }

  const handleChangeTime = ({ target: { value: time } }) => {
    setUpdatedDate(changedTime(time)['updatedDate']);
  }

  const handleChangeUrl = ({ target: { value: url } }) => {
    setUrl(url);
    setIsValid(isValidUrl(prependHttp(url, { https: true })));
  }

  const handleClearImage = () => {
    setSelectedImage(null);
    refocusModal();
  }

  const handleEditBlock = () => {
    onEditBlock(setBlock());
    toggle();
  }

  const handleSelectImage = (selectedImage) => {
    setSelectedImage(selectedImage);
  }

  const handleToggleImageAssetPickerModal = () => {
    this.setState(({ isImageAssetPickerModalOpen }) => ({
      isImageAssetPickerModalOpen: !isImageAssetPickerModalOpen,
    }), () => {
      const { isImageAssetPickerModalOpen, selectedImage } = this.state;
      if (!isImageAssetPickerModalOpen) {
        this.refocusModal();
        if (!selectedImage) {
          toggle();
        }
      }
    });
  }

  /**
   * Needs to return the focus to an element else pressing "ESC" to close the modal won't work
   */
  const refocusModal = () => {
    this.button.focus();
  }

  return (
    <Modal
      autoFocus={false}
      centered
      isOpen={isOpen}
      toggle={toggle}
      size="xxl"
      keyboard={!isImageAssetPickerModalOpen}
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
            isImageAssetPickerModalOpen={isImageAssetPickerModalOpen}
            isLink={isLink}
            isNsfw={isNsfw}
            isValid={isValid}
            launchText={launchText}
            node={node}
            onChangeAspectRatio={handleChangeAspectRatio}
            onChangeCaption={handleChangeCaption}
            onChangeCheckBox={handleChangeCheckbox}
            onChangeDate={handleChangeDate}
            onChangeLaunchText={handleChangeLaunchText}
            onChangeTheme={handleChangeTheme}
            onChangeTime={handleChangeTime}
            onChangeUrl={handleChangeUrl}
            onClearImage={handleClearImage}
            onSelectImage={handleSelectImage}
            onToggleImageAssetPickerModal={handleToggleImageAssetPickerModal}
            selectedImage={selectedImage}
            theme={theme}
            updatedDate={updatedDate}
            url={url}
          />
        </ScrollableContainer>
      </ModalBody>
      <ModalFooter>
        <Button onClick={toggle} innerRef={(el) => { button = el; }}>Cancel</Button>
        <Button
          disabled={!isValid || !selectedImage}
          onClick={isFreshBlock ? handleAddBlock : handleEditBlock}
        >
          {isFreshBlock ? 'Add' : 'Update'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
export default ImageBlockModal;