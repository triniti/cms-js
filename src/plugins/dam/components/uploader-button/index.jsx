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
    ...btnProps
  } = props;

  const [ isUploaderOpen, setIsUploaderOpen ] = useState(false);
  const handleToggleUploader = () => {
    setIsUploaderOpen(!isUploaderOpen);
  }

  return (
    <>
      <Button key="a" style={{ margin: 0 }} color="primary" onClick={handleToggleUploader} {...btnProps}>{children || 'Upload files'}</Button>
      {isUploaderOpen && (
        <Uploader
          allowMultiUpload={allowMultiUpload}
          isOpen={isUploaderOpen}
          linkedRefs={linkedRefs}
          onToggleUploader={handleToggleUploader}
          onClose={onClose}
          />
      )}
    </>
  );
}

export default UploaderButton;
