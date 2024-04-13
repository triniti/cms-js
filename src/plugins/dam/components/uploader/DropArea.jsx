import React from 'react';
import Dropzone from 'react-dropzone'; 
import { Icon } from '@triniti/cms/components';


export default ({
  allowedMimeTypes = [],
  allowMultiUpload: multiple,
  onDrop: handleOnDrop,
  onDropRejected: handleOnDropRejected,
}) => {
  const accept = {}; // eg: accept['text/html'] = [];
  allowedMimeTypes.map(x => accept[x] = []);

  return (
    <Dropzone
      accept={accept}
      autoFocus={true}
      multiple={multiple}
      onDropAccepted={handleOnDrop}
      onDropRejected={handleOnDropRejected}
    >
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()} className="dam-drop-zone-component">
          <div className="dam-drop-zone-content">
            <input {...getInputProps()} />
            <Icon imgSrc="cloud-upload" />
            <span className="txt">
              Try dropping some files here,
              or click to select files to upload.
            </span>
          </div>
        </div>
      )}
    </Dropzone>
  );
};
