import noop from 'lodash/noop';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, ModalFooter } from '@triniti/admin-ui-plugin/components';

const Footer = ({
  activeStep,
  innerRef,
  isFreshBlock,
  isNextButtonDisabled,
  onAddBlock: handleAddBlock,
  onDecrementStep: handleDecrementStep,
  onEditBlock: handleEditBlock,
  onIncrementStep: handleIncrementStep,
  toggle,
}) => (
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

Footer.propTypes = {
  activeStep: PropTypes.oneOf([0, 1]).isRequired,
  innerRef: PropTypes.func,
  isFreshBlock: PropTypes.bool.isRequired,
  isNextButtonDisabled: PropTypes.bool.isRequired,
  onAddBlock: PropTypes.func.isRequired,
  onDecrementStep: PropTypes.func.isRequired,
  onEditBlock: PropTypes.func.isRequired,
  onIncrementStep: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
};


Footer.defaultProps = {
  innerRef: noop,
};

export default Footer;
