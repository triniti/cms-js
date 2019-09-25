import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

import { Button } from '@triniti/admin-ui-plugin/components';

import Uploader from '@triniti/cms/plugins/dam/components/uploader';

const NotFoundMessage = ({
  node,
  onCloseUploader: handleCloseUploader,
  onToggleUploader: handleToggleUploader,
  isUploaderOpen,
}) => (
  <div className="not-found-message">
    <p className="mr-2">No audio assetes found that match your search. You can</p>
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
        allowedMimeTypes={['audio/mp3']}
        isOpen={isUploaderOpen}
        linkedRefs={node ? [NodeRef.fromNode(node)] : []}
        mimeTypeErrorMessage="Invalid Action: attempt to upload non-MP3 audio asset. Please upload only MP3s."
        onClose={handleCloseUploader}
        onToggleUploader={handleToggleUploader}
      />
    </div>
    <p>new audio assets.</p>
  </div>
);

NotFoundMessage.propTypes = {
  isUploaderOpen: PropTypes.bool.isRequired,
  node: PropTypes.instanceOf(Message).isRequired,
  onCloseUploader: PropTypes.func.isRequired,
  onToggleUploader: PropTypes.func.isRequired,
};

export default NotFoundMessage;
