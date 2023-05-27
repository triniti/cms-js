import React, { useState } from 'react';
import PollPickerField from 'plugins/apollo/components/poll-picker-field';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import Stepper from 'components/blocksmith-field/components/stepper';
import { Icon, ScrollableContainer } from 'components';
import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';

export default function PollGridBlockModal ({
  block,
  isFreshBlock,
  isOpen = false,
  pollRefs = null,
  onAddBlock,
  onEditBlock,
  toggle,
}) {
  console.log('PollGridBlockModal', { block, isFreshBlock, isOpen, pollRefs, onAddBlock, onEditBlock, toggle });
  window.props = {
    block,
    isFreshBlock,
    isOpen,
    pollRefs,
    onAddBlock,
    onEditBlock,
    toggle,
  };

  const [ activeStep, setActiveStep ] = useState(block.has('node_ref') ? 1 : 0);
  const [ aside, setAside] = useState(block.get('aside', false));
  const [ hasUpdatedDate, setHasUpdatedDate ] = useState(block.has('updated_date'));
  const [ selectedPollRefs, setSelectedPollRefs ] = useState(pollRefs || []);

  const setBlock = () => {
    return block.schema().createMessage()
      .addToList('node_refs', selectedPollRefs)
      .set('aside', aside)
      .set('updated_date', hasUpdatedDate ? updatedDate : null);
  }

  const handleAddBlock = () => {
    onAddBlock(setBlock());
    toggle();
  }

  const handleEditBlock = () => {
    onEditBlock(setBlock());
    toggle();
  }

  const handleChangeCheckbox = ({ target: { id, checked } }) => {
    this.setState({ [id]: checked });
  }

  const handleChangeDate = (date) => {
    this.setState(changedDate(date));
  }

  const handleChangeTime = ({ target: { value: time } }) => {
    this.setState(changedTime(time));
  }

  const handleChangeStep = () => {
    this.setState(({ activeStep }) => ({ activeStep: activeStep ? 0 : 1 }));
  }

  return (
    <Modal centered isOpen={isOpen} toggle={toggle} size="xxl">
      <ModalHeader toggle={toggle}>
        <span className="nowrap">{`${isFreshBlock ? 'Add' : 'Update'} Poll Grid Block`}</span>
        <div className="ml-auto d-none d-sm-block" style={{ width: '60%', minWidth: '330px' }}>
          <Stepper
            className="p-0 bg-gray-100 stepper-items-3"
            steps={[
              {
                title: 'Select Polls',
              },
              {
                title: 'Customize Options',
              },
            ]}
            activeStep={activeStep}
            horizontal
            fullWidth
          />
        </div>
      </ModalHeader>
      <ModalBody className="p-0">
        <ScrollableContainer
          className="bg-gray-400"
          style={{ height: 'calc(100vh - 167px)' }}
        >
          <div className="modal-body-blocksmith">
            {activeStep === 0
              && (
                <PollPickerField
                  label="Select Polls"
                  className="sticky-top"
                  name="polls"
                  isMulti
                  sortable
                  setSelectedPollRefs={setSelectedPollRefs}
                />
              )}
            {activeStep === 1
              && (
                <div className="modal-body-blocksmith">
                  <FormGroup inline className="d-flex justify-content-center form-group-mobile px-3 mb-2">
                    <FormGroup className="mr-4">
                      <Checkbox size="sd" id="hasUpdatedDate" checked={hasUpdatedDate} onChange={handleChangeCheckbox}>
                        Is update
                      </Checkbox>
                      <Checkbox size="sd" id="aside" checked={aside} onChange={handleChangeCheckbox} className="ml-3">
                        Aside
                      </Checkbox>
                      <Icon imgSrc="info-outline" id="aside-tooltip" size="xs" className="ml-1" />
                      <UncontrolledTooltip target="aside-tooltip">Is only indirectly related to the main content.</UncontrolledTooltip>
                    </FormGroup>
                  </FormGroup>
                  {hasUpdatedDate
                  && (
                    <DateTimePicker
                      onChangeDate={handleChangeDate}
                      onChangeTime={handleChangeTime}
                      updatedDate={updatedDate}
                    />
                  )}
              </div>
              )}
          </div>
        </ScrollableContainer>
      </ModalBody>
      <ModalFooter>
        <Button onClick={toggle}>Cancel</Button>
        <Button
          disabled={activeStep === 0}
          onClick={handleChangeStep}
        >
          Prev
        </Button>
        <Button
          disabled={!selectedPollRefs.length || activeStep === 1}
          onClick={handleChangeStep}
        >
          Next
        </Button>
        <Button
          disabled={activeStep !== 1}
          onClick={isFreshBlock ? handleAddBlock : handleEditBlock}
        >
          {isFreshBlock ? 'Add' : 'Update'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}