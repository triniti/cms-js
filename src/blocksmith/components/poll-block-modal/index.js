import React, { useState } from 'react';
import { FormGroup, Modal, ModalBody } from 'reactstrap';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import { SwitchField } from '@triniti/cms/components/index.js';
import Footer from '@triniti/cms/blocksmith/components/poll-block-modal/Footer.js';
import Header from '@triniti/cms/blocksmith/components/poll-block-modal/Header.js';
import SelectPoll from '@triniti/cms/blocksmith/components/poll-block-modal/SelectPoll.js';
import Preview from '@triniti/cms/blocksmith/components/poll-block-modal/Preview.js';

export default function PollBlockModal(props) {
  const { block, isFreshBlock, isOpen, node, onAddBlock: handleAddBlock, onEditBlock: handleEditBlock, toggle } = props;

  const [ activeStep, setActiveStep ] = useState(block.has('node_ref') ? 1 : 0);
  const [ aside, setAside] = useState(block.get('aside', false));
  const [ selectedPollNode, setSelectedPollNode ] = useState(null);
  const [ selectedPollNodeRef, setSelectedPollNodeRef ] = useState(block.get('node_ref', null));

  const handleSelectPoll = (pollNode) => {
    setSelectedPollNode(pollNode);
    setSelectedPollNodeRef(NodeRef.fromNode(pollNode));
    setActiveStep(1);
  }

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
              setSelectedPollNode={handleSelectPoll}
            />
          )}
          {activeStep === 1 && (
            <div className="container-lg py-5">
              <Preview nodeRef={`${selectedPollNodeRef}`} />
              <FormGroup className="mb-4">
                <SwitchField
                  name="aside"
                  label="Aside"
                  checked={aside}
                  onChange={(e) => setAside(e.target.checked)}
                  tooltip="Is only indirectly related to the main content."
                />
              </FormGroup>
            </div>
          )}
        </ModalBody>
      </div>
      <Footer
        activeStep={activeStep}
        node={node}
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
