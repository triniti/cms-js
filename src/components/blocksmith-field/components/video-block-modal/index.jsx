import React, { useState } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import Footer from '@triniti/cms/components/blocksmith-field/components/video-block-modal/Footer';
import Header from '@triniti/cms/components/blocksmith-field/components/video-block-modal/Header';
import CustomizeOptions from '@triniti/cms/components/blocksmith-field/components/video-block-modal/CustomizeOptions';
import SelectArticle from '@triniti/cms/components/blocksmith-field/components/video-block-modal/SelectVideo';

export default function VideoBlockModal(props) {
  const { block, isFreshBlock, isOpen, node, onAddBlock: handleAddBlock, onEditBlock: handleEditBlock, toggle } = props;

  const [activeStep, setActiveStep] = useState(block.has('node_ref') ? 1 : 0);
  const [aside, setAside] = useState(block.get('aside', false));
  const [autoPlay, setAutoPlay] = useState(block.get('autoplay', false));
  const [launchText, setLaunchText] = useState(block.get('launch_text', ''));
  const [muted, setMuted] = useState(block.get('muted', false));
  const [showMoreVideos, setShowMoreVideos] = useState(block.get('show_more_videos', false));
  const [startAt, setStartAt] = useState(block.get('start_at', 0));
  const [selectedVideoNode, setSelectedVideoNode] = useState(null);
  const [selectedVideoNodeRef, setSelectedVideoNodeRef] = useState(block.get('node_ref', null));
  const [selectedImageRef, setSelectedImageRef] = useState(block.get('poster_image_ref', null));

  const setBlock = () => {
    return block
      .set('node_ref', selectedVideoNodeRef ? selectedVideoNodeRef : NodeRef.fromNode(selectedVideoNode))
      .set('aside', aside)
      .set('autoplay', autoPlay)
      .set('launch_text', launchText)
      .set('muted', muted)
      .set('show_more_videos', showMoreVideos)
      .set('start_at', startAt)
      .set('poster_image_ref', selectedImageRef);
  }

  return (
    <Modal
      autoFocus={false}
      centered
      isOpen={isOpen}
      toggle={toggle}
      size="xxl"
    >
      <Header
        activeStep={activeStep}
        isFreshBlock={isFreshBlock}
        toggle={toggle}
      />
      <div className="modal-scrollable">
        <ModalBody className="p-0">
          {activeStep === 0 && (
            <SelectArticle
              selectedVideoNode={selectedVideoNode}
              setSelectedVideoNode={setSelectedVideoNode}
            />
          )}
          {activeStep === 1 && (
            <CustomizeOptions
              aside={aside}
              setAside={setAside}
              autoPlay={autoPlay}
              setAutoPlay={setAutoPlay}
              muted={muted}
              setMuted={setMuted}
              selectedVideoNode={selectedVideoNode}
              selectedVideoNodeRef={selectedVideoNodeRef}
              selectedImageRef={selectedImageRef}
              setImageRef={setSelectedImageRef}
              launchText={launchText}
              setLaunchText={setLaunchText}
              showMoreVideos={showMoreVideos}
              setShowMoreVideos={setShowMoreVideos}
              startAt={startAt}
              setStartAt={setStartAt}
            />
          )}
        </ModalBody>
      </div>
      <Footer
        activeStep={activeStep}
        node={node}
        toggle={toggle}
        onDecrementStep={() => setActiveStep(activeStep - 1)}
        onIncrementStep={() => setActiveStep(activeStep + 1)}
        isNextButtonDisabled={(activeStep === 0 && !selectedVideoNode) || activeStep === 1}
        onAddBlock={() => {
          handleAddBlock(setBlock());
          toggle();
        }}
        onEditBlock={() => {
          handleEditBlock(setBlock());
          toggle();
        }}
        isFreshBlock={isFreshBlock}
      />
    </Modal>
  );
}
