import noop from 'lodash/noop';
import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';
import { Button, ModalFooter } from '@triniti/admin-ui-plugin/components';

const Footer = ({
  activeStep,
  blockKey,
  block,
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
      onClick={
        isFreshBlock
          ? () => handleAddBlock(block, blockKey)
          : () => handleEditBlock(block, blockKey)
}
    >
      {isFreshBlock ? 'Add' : 'Update'}
    </Button>
  </ModalFooter>
);
Footer.propTypes = {
  activeStep: PropTypes.oneOf([0, 1]).isRequired,
  blockKey: PropTypes.string.isRequired,
  block: PropTypes.instanceOf(Message).isRequired,
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
