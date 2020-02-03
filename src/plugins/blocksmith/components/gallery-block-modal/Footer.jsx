import React from 'react';
import PropTypes from 'prop-types';
import { Button, ModalFooter } from '@triniti/admin-ui-plugin/components';

const Footer = ({
  activeStep,
  blockKey,
  block,
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
      onClick={
        isFreshBlock 
        ? () => handleAddBlock(block, blockKey) 
        : handleEditBlock(block, blockKey)
      }
    >
      {isFreshBlock ? 'Add' : 'Update'}
    </Button>
  </ModalFooter>
);

Footer.propTypes = {
  activeStep: PropTypes.oneOf([0, 1]).isRequired,
  innerRef: PropTypes.func.isRequired,
  isFreshBlock: PropTypes.bool.isRequired,
  isNextButtonDisabled: PropTypes.bool.isRequired,
  onAddBlock: PropTypes.func.isRequired,
  onDecrementStep: PropTypes.func.isRequired,
  onEditBlock: PropTypes.func.isRequired,
  onIncrementStep: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default Footer;
