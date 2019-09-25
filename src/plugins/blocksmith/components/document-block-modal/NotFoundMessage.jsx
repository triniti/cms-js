import React from 'react';
import PropTypes from 'prop-types';

import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { Button } from '@triniti/admin-ui-plugin/components';

import Uploader from '@triniti/cms/plugins/dam/components/uploader';

const NotFoundMessage = ({
  allowedMimeTypes,
  isUploaderOpen,
  node,
  onCloseUploader: handleCloseUploader,
  onToggleUploader: handleToggleUploader,
}) => (
  <div className="not-found-message">
    <p className="mr-2">No documents found that match your search. You can</p>
    <div className="d-inline-flex">
      <Button
        className="mr-2"
        color="light"
        onClick={handleToggleUploader}
        size="sm"
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
      />
    </div>
    <p>new documents</p>
  </div>
);

NotFoundMessage.propTypes = {
  allowedMimeTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  isUploaderOpen: PropTypes.bool.isRequired,
  node: PropTypes.instanceOf(Message).isRequired,
  onCloseUploader: PropTypes.func.isRequired,
  onToggleUploader: PropTypes.func.isRequired,
};

export default NotFoundMessage;
