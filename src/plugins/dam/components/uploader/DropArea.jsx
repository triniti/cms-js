import React, { useState } from 'react';
import Dropzone, { useDropzone } from 'react-dropzone'; 
import PropTypes from 'prop-types';
import { Icon } from 'components';


const DropArea = ({
  allowedMimeTypes = [],
  allowMultiUpload: multiple,
  onDrop: handleOnDrop,
  onDropRejected: handleOnDropRejected,
}) => {
  const [uploading, setUploading] = useState(false);
  const [controller, setController] = useState(null);

  const handleCancel = () => {
    if (controller) {
      controller.abort();
    }
    setUploading(false);
  };

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

DropArea.propTypes = {
  allowedMimeTypes: PropTypes.arrayOf(PropTypes.string),
  allowMultiUpload: PropTypes.bool,
  onDrop: PropTypes.func,
  onDropRejected: PropTypes.func,
};

export default DropArea;
