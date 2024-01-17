import React, { useState } from 'react';
import noop from 'lodash-es/noop';
import { Button } from 'reactstrap';
import Uploader from 'plugins/dam/components/uploader';

const UploaderButton = (props) => {
  const {
    children = null,
    linkedRefs = null,
    onClose = noop,
    allowMultiUpload = true,
    isUploaderOpen,
    onToggleUploader,
    ...btnProps
  } = props;

  return (
    <>
      <Button key="a" style={{ margin: 0 }} color="primary" onClick={onToggleUploader} {...btnProps}>{children || 'Upload files'}</Button>
      {isUploaderOpen && (
        <Uploader
          allowMultiUpload={allowMultiUpload}
          isOpen={isUploaderOpen}
          linkedRefs={linkedRefs}
          onToggleUploader={onToggleUploader}
          onClose={onClose}
          />
      )}
    </>
  );
}

export default UploaderButton;
