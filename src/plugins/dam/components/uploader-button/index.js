import React, { useEffect, useState } from 'react';
import noop from 'lodash-es/noop.js';
import { Button } from 'reactstrap';
import Uploader from '@triniti/cms/plugins/dam/components/uploader';

const UploaderButton = (props) => {
  const {
    children = null,
    linkedRefs = null,
    onClose = noop,
    allowMultiUpload = true,
    uploaderProps = {},
    ...btnProps
  } = props;

  const [ isUploaderOpen, setIsUploaderOpen ] = useState(false);
  const [ shouldRenderUploader, setShouldRenderUploader] = useState(false);

  useEffect(()=>{
    if(isUploaderOpen){
      setShouldRenderUploader(true);
    }else {
      setShouldRenderUploader(false);
    }
  },[isUploaderOpen]);

  const handleToggleUploader = () => {
    setIsUploaderOpen(prevState => !prevState);
  }

  return (
    <>
      <Button key="a" style={{ margin: 0 }} color="primary" onClick={handleToggleUploader} {...btnProps}>{children || 'Upload files'}</Button>
      {shouldRenderUploader && (
        <Uploader
          allowMultiUpload={allowMultiUpload}
          isOpen={isUploaderOpen}
          linkedRefs={linkedRefs}
          onToggleUploader={handleToggleUploader}
          onClose={onClose}
          {...uploaderProps}
          />
      )}
    </>
  );
}

export default UploaderButton;
