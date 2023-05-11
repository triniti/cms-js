import AspectRatio from '@triniti/schemas/triniti/common/enums/AspectRatio';
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
import CustomizeOptions from './CustomizeOptions';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';

const ImageBlockModal = ({
  image = null,
  block,
  isFreshBlock,
  isOpen,
  onAddBlock,
  toggle,
}) => {
  const [ aside, setAside ] = useState(block.get('aside'));
  const [ aspectRatio, setAspectRatio ] = useState(block.get('aspect_ratio', AspectRatio.AUTO));
  const [ caption, setCaption ] = useState(block.get('caption', ''));
  const [ hasCaption, setHasCaption ] = useState(block.has('caption'));
  const [ hasUpdatedDate, setHasUpdatedDate ] = useState(block.has('updated_date'));
  const [ isLink, setIsLink ] = useState(block.has('url'));
  const [ isNsfw, setIsNsfw ] = useState(block.get('is_nsfw'));
  const [ isValid, setIsValid ] = useState(true);
  const [ launchText, setLaunchText ] = useState(block.get('launch_text', null));
  const [ selectedImage, setSelectedImage ] = useState(image || null);
  const [ theme, setTheme ] = useState(block.get('theme', null));
  const [ updatedDate, setUpdatedDate ] = useState(block.get('updated_date', new Date()));
  const [ url, setUrl ] = useState(block.get('url', ''));
  
  const imageRef = `${block.get('node_ref')}`;

  const handleUploadedImage = (nodes) => {
    if (!nodes.length) {
      return;
    } 
    
    setSelectedImage(NodeRef.fromNode(nodes[0]));
  }

  const setBlock = () => {
    block
      .set('aside', aside)
      .set('aspect_ratio', aspectRatio)
      .set('caption', hasCaption && caption ? caption : null)
      .set('is_nsfw', isNsfw)
      .set('launch_text', launchText || null)
      .set('node_ref', selectedImage ? NodeRef.fromString(`${selectedImage}`) : null)
      .set('updated_date', hasUpdatedDate ? updatedDate : null)
      .set('url', (isLink && url && isValid) ? prependHttp(url, { https: true }) : null);

    if (block.schema().hasMixin('triniti:common:mixin:themeable')) {
      block.set('theme', theme);
    }

    return block;
  }

  const handleAddBlock = () => {
    onAddBlock(setBlock());
    toggle();
  }

  const handleChangeCaption = ({ target: { value: caption } }) => {
    setCaption(caption);
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
    // onEditBlock(setBlock());
    setBlock();
    toggle();
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
    >
      <ModalHeader toggle={toggle}>
        <span className="nowrap">{`${isFreshBlock ? 'Add' : 'Update'} Image Block`}</span>
      </ModalHeader>
      <ModalBody className="p-0 bg-gray-400">
        <ScrollableContainer
          style={{ height: 'calc(100vh - 168px)' }}
        >
          <CustomizeOptions
            block={block}
            aside={aside}
            aspectRatio={aspectRatio}
            caption={caption}
            hasCaption={hasCaption}
            hasUpdatedDate={hasUpdatedDate}
            isLink={isLink}
            isNsfw={isNsfw}
            isValid={isValid}
            launchText={launchText}
            imageRef={imageRef}
            onChangeUrl={handleChangeUrl}
            onClearImage={handleClearImage}
            onUploadedImage={handleUploadedImage}
            setCaption={setCaption}
            setHasCaption={setHasCaption}
            setHasUpdatedDate={setHasUpdatedDate}
            setIsLink={setIsLink}
            setIsNsfw={setIsNsfw}
            setLaunchText={setLaunchText}
            setSelectedImage={setSelectedImage}
            setAside={setAside}
            setAspectRatio={setAspectRatio}
            setTheme={setTheme}
            setUpdatedDate={setUpdatedDate}
            selectedImage={selectedImage}
            theme={theme}
            updatedDate={updatedDate}
            url={url}
          />
        </ScrollableContainer>
      </ModalBody>
      <ModalFooter>
        <Button onClick={toggle} innerRef={(el) => { /*button = el;*/ }}>Cancel</Button>
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