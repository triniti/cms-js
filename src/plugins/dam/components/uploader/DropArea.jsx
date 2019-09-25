import React from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import { Icon } from '@triniti/admin-ui-plugin/components';

const DropArea = ({ onDrop }) => (
  <Dropzone onDrop={onDrop}>
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

DropArea.propTypes = {
  onDrop: PropTypes.func.isRequired,
};

export default DropArea;
