import React, { useState } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import CustomizeOptions from 'components/blocksmith-field/components/poll-block-modal/CustomizeOptions';
import Footer from 'components/blocksmith-field/components/poll-block-modal/Footer';
import Header from 'components/blocksmith-field/components/poll-block-modal/Header';
import SelectPoll from 'components/blocksmith-field/components/poll-block-modal/SelectPoll';

export default function PollBlockModal(props) {
  const { block, isFreshBlock, isOpen, node, onAddBlock: handleAddBlock, onEditBlock: handleEditBlock, toggle } = props;

  const [activeStep, setActiveStep] = useState(block.has('node_ref') ? 1 : 0);
  const [aside, setAside] = useState(block.get('aside', false));
  const [selectedPollNode, setSelectedPollNode] = useState(null);
  const [selectedPollNodeRef, setSelectedPollNodeRef] = useState(block.get('node_ref', null));

  const setBlock = () => {
    return block
      .set('node_ref', selectedPollNodeRef ? selectedPollNodeRef : NodeRef.fromNode(selectedPollNode))
      .set('aside', aside);
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
            <SelectPoll
              selectedPollNode={selectedPollNode}
              setSelectedPollNode={setSelectedPollNode}
            />
          )}
          {activeStep === 1 && (
            <CustomizeOptions
              aside={aside}
              setAside={setAside}
              selectedPollNode={selectedPollNode}
              selectedPollNodeRef={selectedPollNodeRef}
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
        isNextButtonDisabled={(activeStep === 0 && !selectedPollNode) || activeStep === 1}
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
