import React from 'react';
import PropTypes from 'prop-types';

import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { Button, ModalFooter } from '@triniti/admin-ui-plugin/components';

import Uploader from '@triniti/cms/plugins/dam/components/uploader';

const Footer = ({
  block,
  blockKey,
  allowedMimeTypes,
  activeStep,
  innerRef,
  isFreshBlock,
  isImageSelected,
  isNextButtonDisabled,
  node,
  onAddBlock: handleAddBlock,
  onCloseUploader: handleCloseUploader,
  onDecrementStep: handleDecrementStep,
  onEditBlock: handleEditBlock,
  onIncrementStep: handleIncrementStep,
  onToggleUploader: handleToggleUploader,
  toggle,
  isUploaderOpen,
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
            allowedMimeTypes={allowedMimeTypes}
            isOpen={isUploaderOpen}
            linkedRefs={node ? [NodeRef.fromNode(node)] : []}
            mimeTypeErrorMessage="Invalid Action: attempt to upload non-document asset. Please upload only PDF or text files."
            onClose={handleCloseUploader}
            onToggleUploader={handleToggleUploader}
            allowMultiUpload={false}
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
      disabled={activeStep !== 1 || !isImageSelected}
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
  activeStep: PropTypes.oneOf([0, 1, 2]).isRequired,
  allowedMimeTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  innerRef: PropTypes.func.isRequired,
  isFreshBlock: PropTypes.bool.isRequired,
  isImageSelected: PropTypes.bool.isRequired,
  isNextButtonDisabled: PropTypes.bool.isRequired,
  isUploaderOpen: PropTypes.bool.isRequired,
  node: PropTypes.instanceOf(Message).isRequired,
  onAddBlock: PropTypes.func.isRequired,
  onCloseUploader: PropTypes.func.isRequired,
  onDecrementStep: PropTypes.func.isRequired,
  onEditBlock: PropTypes.func.isRequired,
  onIncrementStep: PropTypes.func.isRequired,
  onToggleUploader: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default Footer;
