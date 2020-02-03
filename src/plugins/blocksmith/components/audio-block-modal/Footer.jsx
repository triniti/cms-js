import React from 'react';
import PropTypes from 'prop-types';

import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { Button, ModalFooter } from '@triniti/admin-ui-plugin/components';

import Uploader from '@triniti/cms/plugins/dam/components/uploader';

import { ALLOWED_MIME_TYPES } from './constants';

const Footer = ({
  activeStep,
  blockKey,
  block,
  innerRef,
  isFreshBlock,
  isNextButtonDisabled,
  isUploaderOpen,
  node,
  onAddBlock: handleAddBlock,
  onDecrementStep: handleDecrementStep,
  onEditBlock: handleEditBlock,
  onIncrementStep: handleIncrementStep,
  onToggleUploader: handleToggleUploader,
  toggle,
}) => (
  <ModalFooter>
    {
      activeStep === 0
      && (
        <div className="d-inline-flex mr-auto">
          <Button
            className="mr-auto"
            color="primary"
            onClick={handleToggleUploader}
          >
            Upload
          </Button>
          <Uploader
            allowedMimeTypes={ALLOWED_MIME_TYPES}
            isOpen={isUploaderOpen}
            linkedRefs={node ? [NodeRef.fromNode(node)] : []}
            mimeTypeErrorMessage={`Invalid Action: Attempt to upload disallowed audio asset. Allowed ones are ${ALLOWED_MIME_TYPES.join(', ')}.`}
            onToggleUploader={handleToggleUploader}
          />
        </div>
      )
    }
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
      disabled={activeStep === 0}
      onClick={isFreshBlock ? () => handleAddBlock(block, blockKey) : () => handleEditBlock(block, blockKey)}
    >
      {isFreshBlock ? 'Add' : 'Update'}
    </Button>
  </ModalFooter>
);

Footer.propTypes = {
  activeStep: PropTypes.number.isRequired,
  blockKey: PropTypes.string.isRequired,
  block: PropTypes.instanceOf(Message).isRequired,
  innerRef: PropTypes.func.isRequired,
  isFreshBlock: PropTypes.bool.isRequired,
  isNextButtonDisabled: PropTypes.bool.isRequired,
  isUploaderOpen: PropTypes.bool.isRequired,
  node: PropTypes.instanceOf(Message).isRequired,
  onAddBlock: PropTypes.func.isRequired,
  onDecrementStep: PropTypes.func.isRequired,
  onEditBlock: PropTypes.func.isRequired,
  onIncrementStep: PropTypes.func.isRequired,
  onToggleUploader: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default Footer;
