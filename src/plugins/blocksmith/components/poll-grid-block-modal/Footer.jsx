import React from 'react';
import PropTypes from 'prop-types';
import { Button, ModalFooter } from '@triniti/admin-ui-plugin/components';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

const Footer = ({
  activeStep,
  isFreshBlock,
  onAddBlock: handleAddBlock,
  onChangeStep: handleChangeStep,
  onEditBlock: handleEditBlock,
  selectedPollRefs,
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
);

Footer.propTypes = {
  activeStep: PropTypes.oneOf([0, 1]).isRequired,
  isFreshBlock: PropTypes.bool.isRequired,
  onAddBlock: PropTypes.func.isRequired,
  onChangeStep: PropTypes.func.isRequired,
  onEditBlock: PropTypes.func.isRequired,
  selectedPollRefs: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
  toggle: PropTypes.func.isRequired,
};

Footer.defaultProps = {
  selectedPollRefs: [],
};

export default Footer;
