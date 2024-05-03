import React, { useEffect, useState } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import Footer from '@triniti/cms/components/blocksmith-field/components/audio-block-modal/Footer';
import Header from '@triniti/cms/components/blocksmith-field/components/audio-block-modal/Header';
import CustomizeOptions from '@triniti/cms/components/blocksmith-field/components/audio-block-modal/CustomizeOptions';
import SelectAudio from '@triniti/cms/components/blocksmith-field/components/audio-block-modal/SelectAudio';
import useNode from 'plugins/ncr/components/useNode';
import noop from 'lodash-es/noop';

export default function AudioBlockModal(props) {
  const { block, isFreshBlock, isOpen, onAddBlock: handleAddBlock, onEditBlock: handleEditBlock, toggle } = props;

  const [activeStep, setActiveStep] = useState(block.has('node_ref') ? 1 : 0);
  const [aside, setAside] = useState(block.get('aside', false));
  const [launchText, setLaunchText] = useState(block.get('launch_text', ''));
  const [selectedAudioNode, setSelectedAudioNode] = useState(null);
  const [selectedAudioRef, setSelectedAudioRef] = useState(block.get('node_ref', null));
  const [selectedImageRef, setSelectedImageRef] = useState(block.get('image_ref', null));
  const { node } = useNode(selectedAudioRef, false);

  useEffect(() => {
    if (!node || selectedAudioNode) {
      return noop;
    }
    setSelectedAudioNode(node);
  }, [`${selectedAudioRef}`]);

  const setBlock = () => {
    return block
      .set('node_ref', selectedAudioRef ? selectedAudioRef : NodeRef.fromNode(selectedAudioNode))
      .set('aside', aside)
      .set('launch_text', launchText)
      .set('image_ref', selectedImageRef);
  }

  return (
    <Modal
      autoFocus={false}
      centered
      isOpen={isOpen}
      toggle={toggle}
      size="xl"
    >
      <Header
        activeStep={activeStep}
        isFreshBlock={isFreshBlock}
        toggle={toggle}
      />
      <div className="modal-scrollable">
        <ModalBody className="p-0">
          {activeStep === 0 && (
            <SelectAudio
              selectedAudioNode={selectedAudioNode}
              setSelectedAudioNode={setSelectedAudioNode}
            />
          )}
          {activeStep === 1 && (
            <CustomizeOptions
              aside={aside}
              setAside={setAside}
              selectedImageRef={selectedImageRef}
              setImageRef={setSelectedImageRef}
              selectedAudioNode={selectedAudioNode}
              selectedAudioRef={selectedAudioRef}
              launchText={launchText}
              setLaunchText={setLaunchText}
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
        isNextButtonDisabled={(activeStep === 0 && !selectedAudioNode) || activeStep === 1}
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
