import AspectRatioEnum from '@triniti/schemas/triniti/common/enums/AspectRatio';
import GalleryGrid from './GalleryGrid';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import React, { useState } from 'react';
import { ScrollableContainer } from '@triniti/cms/components';
import {
  Modal,
  ModalBody,
} from 'reactstrap';
import CustomizeOptions from './CustomizeOptions';
import Footer from './Footer';
import Header from './Header';
import './styles.scss';

const GalleryBlockModal = ({
  gallery = null,
  image = null,
  isOpen = false,
  block,
  isFreshBlock,
  onAddBlock,
  onEditBlock,
  toggle,
}) => {

  const [ activeStep, setActiveStep ] = useState(0);
  const [ aside, setAside ] = useState(block.get('aside'));
  const [ aspectRatio, setAspectRatio ] = useState(block.get('aspect_ratio', AspectRatioEnum.AUTO));
  const [ launchText, setLaunchText ] = useState(block.get('launch_text', ''));
  const [ selectedGallery, setSelectedGallery ] = useState(gallery || null);
  const [ selectedImageRef, setSelectedImageRef ] = useState(image || null);
  const [ startsAtPoster, setStartsAtPoster ] = useState(block.get('start_at_poster'));
  const [ title, setTitle ] = useState(block.get('title', ''));

  const setBlock = () => {
    return block
      .set('aside', aside)
      .set('aspect_ratio', aspectRatio)
      .set('launch_text', launchText || null)
      .set('node_ref', NodeRef.fromNode(selectedGallery))
      .set('poster_image_ref', selectedImageRef ? selectedImageRef : null)
      .set('start_at_poster', startsAtPoster)
      .set('title', title || null)
  }

  const handleAddBlock = () => {
    onAddBlock(setBlock());
    toggle();
  }

  const handleChangeStartAtPoster = () => {
    setStartsAtPoster(!startsAtPoster);
  }

  const handleDecrementStep = () => {
    setActiveStep(activeStep - 1);
  }

  const handleIncrementStep = () => {
    setActiveStep(activeStep + 1);
  }

  const handleEditBlock = () => {
    onEditBlock(setBlock());
    toggle();
  }

  const handleSelectGallery = (gallery) => {
    setSelectedGallery(gallery);
    setSelectedImageRef(gallery.get('image_ref'));
  }

  return (
    <Modal
      autoFocus={false}
      centered
      isOpen={isOpen}
      toggle={toggle}
      size="xxl"
    >
      <Header activeStep={activeStep} isFreshBlock={isFreshBlock} toggle={toggle} />
      <ModalBody className="p-0">
        <ScrollableContainer
          className="bg-gray-400"
          style={{ height: `calc(100vh - ${activeStep === 0 ? 212 : 167}px)` }}
        >
          {activeStep === 0 && (
            <GalleryGrid
              onSelectGallery={handleSelectGallery}
              selectedGalleries={selectedGallery ? [selectedGallery] : []}
            />
          )}
          {activeStep === 1 && (
            <CustomizeOptions
              aside={aside}
              aspectRatio={aspectRatio}
              launchText={launchText}
              setLaunchText={setLaunchText}
              onChangeStartAtPoster={handleChangeStartAtPoster}
              onClearImage={() => setSelectedImageRef(null)}
              onSelectImage={setSelectedImageRef}
              setAspectRatio={setAspectRatio}
              selectedGallery={selectedGallery}
              selectedImageRef={selectedImageRef}
              startsAtPoster={startsAtPoster}
              title={title}
              setTitle={setTitle}
              setAside={setAside}
            />
          )}
        </ScrollableContainer>
      </ModalBody>
      <Footer
        activeStep={activeStep}
        isFreshBlock={isFreshBlock}
        isNextButtonDisabled={(activeStep === 0 && !selectedGallery) || activeStep === 1}
        onAddBlock={handleAddBlock}
        onDecrementStep={handleDecrementStep}
        onEditBlock={handleEditBlock}
        onIncrementStep={handleIncrementStep}
        toggle={toggle}
      />
    </Modal>
  );
}

export default GalleryBlockModal;