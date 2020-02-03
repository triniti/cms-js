import React from 'react';
import PropTypes from 'prop-types';
import { Button, ModalFooter } from '@triniti/admin-ui-plugin/components';
import Message from '@gdbots/pbj/Message';

const Footer = ({
  blockKey,
  block,
  activeStep,
  innerRef,
  isFreshBlock,
  onAddBlock: handleAddBlock,
  onChangeStep: handleChangeStep,
  onEditBlock: handleEditBlock,
  selectedVideo,
  toggle,
}) => (
  <ModalFooter>
    <Button onClick={toggle} innerRef={innerRef}>Cancel</Button>
    <Button
      disabled={activeStep === 0}
      onClick={handleChangeStep}
    >
      Prev
    </Button>
    <Button
      disabled={!selectedVideo || activeStep === 1}
      onClick={handleChangeStep}
    >
      Next
    </Button>
    <Button
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
  innerRef: PropTypes.func.isRequired,
  isFreshBlock: PropTypes.bool.isRequired,
  onAddBlock: PropTypes.func.isRequired,
  onChangeStep: PropTypes.func.isRequired,
  onEditBlock: PropTypes.func.isRequired,
  selectedVideo: PropTypes.instanceOf(Message),
  toggle: PropTypes.func.isRequired,
};

Footer.defaultProps = {
  selectedVideo: null,
};

export default Footer;
