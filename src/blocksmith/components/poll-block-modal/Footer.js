import React from 'react';
import { Button, ModalFooter } from 'reactstrap';

export default function Footer({
  activeStep,
  innerRef,
  isFreshBlock,
  isNextButtonDisabled,
  onAddBlock: handleAddBlock,
  onDecrementStep: handleDecrementStep,
  onEditBlock: handleEditBlock,
  onIncrementStep: handleIncrementStep,
  toggle,
}) {
  return (
    <ModalFooter>
      <Button onClick={toggle}>Cancel</Button>
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
        innerRef={innerRef}
        disabled={activeStep !== 1}
        onClick={isFreshBlock ? handleAddBlock : handleEditBlock}
      >
        {isFreshBlock ? 'Add' : 'Update'}
      </Button>
    </ModalFooter>
  );
};
