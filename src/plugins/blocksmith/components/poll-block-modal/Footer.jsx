import React from 'react';
import PropTypes from 'prop-types';
import { Button, ModalFooter } from '@triniti/admin-ui-plugin/components';
import Message from '@gdbots/pbj/Message';

const Footer = ({
  activeStep,
  isFreshBlock,
  onAddBlock: handleAddBlock,
  onChangeStep: handleChangeStep,
  onEditBlock: handleEditBlock,
  selectedPoll,
  toggle,
}) => (
  <ModalFooter>
    <Button onClick={toggle}>Cancel</Button>
    <Button
      disabled={activeStep === 0}
      onClick={handleChangeStep}
    >
      Prev
    </Button>
    <Button
      disabled={!selectedPoll || activeStep === 1}
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
);

Footer.propTypes = {
  activeStep: PropTypes.oneOf([0, 1]).isRequired,
  isFreshBlock: PropTypes.bool.isRequired,
  onAddBlock: PropTypes.func.isRequired,
  onChangeStep: PropTypes.func.isRequired,
  onEditBlock: PropTypes.func.isRequired,
  selectedPoll: PropTypes.instanceOf(Message),
  toggle: PropTypes.func.isRequired,
};

Footer.defaultProps = {
  selectedPoll: null,
};

export default Footer;
