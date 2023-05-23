import React, { useState } from 'react';
import { FormGroup, Modal, ModalBody } from 'reactstrap';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import { SwitchField } from 'components';
import Footer from 'components/blocksmith-field/components/poll-block-modal/Footer';
import Header from 'components/blocksmith-field/components/poll-block-modal/Header';
import SelectPoll from 'components/blocksmith-field/components/poll-block-modal/SelectPoll';
import DateTimePicker from 'components/blocksmith-field/components/date-time-picker';
import PollBlockPreview from './PollBlockPreview';

export default function PollBlockModal(props) {
  const { block, isFreshBlock, isOpen, node, onAddBlock: handleAddBlock, onEditBlock: handleEditBlock, toggle } = props;

  const [ activeStep, setActiveStep ] = useState(block.has('node_ref') ? 1 : 0);
  const [ aside, setAside] = useState(block.get('aside', false));
  const [ selectedPollNode, setSelectedPollNode ] = useState(null);
  const [ selectedPollNodeRef, setSelectedPollNodeRef ] = useState(block.get('node_ref', null));
  const [ hasUpdatedDate, setHasUpdatedDate ] = useState(block.has('updated_date'));
  const [ updatedDate, setUpdatedDate ] = useState(block.get('updated_date', new Date()));

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
              <PollBlockPreview nodeRef={`${selectedPollNodeRef}`} />
              <FormGroup className="mb-4">
                <SwitchField
                  name="hasUpdatedDate"
                  label="Is Update"
                  checked={hasUpdatedDate}
                  onChange={(e) => setHasUpdatedDate(e.target.checked)}
                  />
                {hasUpdatedDate
                  && (
                    <DateTimePicker
                      onChangeDate={date => setUpdatedDate(changedDate(date).updatedDate)}
                      onChangeTime={({ target: { value: time } }) => setUpdatedDate(changedTime(time).updatedDate)}
                      updatedDate={updatedDate}
                    />
                  )}
              </FormGroup>
              <FormGroup className="mb-4">
                <SwitchField
                  name="aside"
                  label="Aside"
                  checked={aside}
                  onChange={(e) => setAside(e.target.checked)}
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
