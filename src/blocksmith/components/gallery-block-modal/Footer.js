import React from 'react';
import { Button, ModalFooter } from 'reactstrap';

const Footer = ({
  activeStep, // 0 or 1
  toggle,
  onDecrementStep: handleDecrementStep,
  onIncrementStep: handleIncrementStep,
  innerRef,
  isNextButtonDisabled,
  onAddBlock: handleAddBlock,
  onEditBlock: handleEditBlock,
  isFreshBlock,
}) => (
  <ModalFooter>
    <Button onClick={toggle} innerRef={innerRef}>Cancel</Button>
    <Button
      disabled={activeStep === 0}
      onClick={handleDecrementStep}
    >
      Prev
    </Button>
    <Button
      disabled={isNextButtonDisabled}
      onClick={handleIncrementStep}
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
);

export default Footer;