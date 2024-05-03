import React, { useState } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import Footer from '@triniti/cms/components/blocksmith-field/components/document-block-modal/Footer';
import Header from '@triniti/cms/components/blocksmith-field/components/document-block-modal/Header';
import CustomizeOptions from '@triniti/cms/components/blocksmith-field/components/document-block-modal/CustomizeOptions';
import SelectAudio from '@triniti/cms/components/blocksmith-field/components/document-block-modal/SelectDocument';

export default function DocumentBlockModal(props) {
  const { block, isFreshBlock, isOpen, node, onAddBlock: handleAddBlock, onEditBlock: handleEditBlock, toggle } = props;

  const [activeStep, setActiveStep] = useState(block.has('node_ref') ? 1 : 0);
  const [aside, setAside] = useState(block.get('aside', false));
  const [aspectRatio, setAspectRatio] = useState(block.get('aspect_ratio', null));
  const [launchText, setLaunchText] = useState(block.get('launch_text', ''));
  const [selectedDocumentNode, setSelectedDocumentNode] = useState(null);
  const [selectedDocumentRef, setSelectedDocumentRef] = useState(block.get('node_ref', null));
  const [selectedImageRef, setSelectedImageRef] = useState(block.get('image_ref', null));

  const setBlock = () => {
    return block
      .set('node_ref', selectedDocumentRef ? selectedDocumentRef : NodeRef.fromNode(selectedDocumentNode))
      .set('aside', aside)
      .set('aspect_ratio', aspectRatio)
      .set('launch_text', launchText)
      .set('image_ref', selectedImageRef);
  }

  return (
    <Modal
      autoFocus={false}
      centered
      isOpen={isOpen}
      toggle={toggle}
      size="xxl"
      // keyboard={!isImageAssetPickerModalOpen}
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
              selectedDocumentNode={selectedDocumentNode}
              setSelectedDocumentNode={setSelectedDocumentNode}
            />
          )}
          {activeStep === 1 && (
            <CustomizeOptions
              aside={aside}
              setAside={setAside}
              aspectRatio={aspectRatio}
              setAspectRatio={setAspectRatio}
              selectedImageRef={selectedImageRef}
              setImageRef={setSelectedImageRef}
              selectedDocumentNode={selectedDocumentNode}
              selectedDocumentRef={selectedDocumentRef}
              launchText={launchText}
              setLaunchText={setLaunchText}
            />
          )}
        </ModalBody>
      </div>
      <Footer
        activeStep={activeStep}
        node={node}
        // onCloseUploader={this.handleCloseUploader}
        toggle={toggle}
        onDecrementStep={() => setActiveStep(activeStep - 1)}
        onIncrementStep={() => setActiveStep(activeStep + 1)}
        isNextButtonDisabled={(activeStep === 0 && !selectedDocumentNode) || activeStep === 1}
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
