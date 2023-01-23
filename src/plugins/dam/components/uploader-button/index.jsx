import React, { lazy, useState } from 'react';
import noop from 'lodash-es/noop';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import Uploader from 'plugins/dam/components/uploader';

const UploaderButton = (props) => {
  const {
    children = null,
    linkedRefs = null,
    onClose = noop,
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
          isOpen={isUploaderOpen}
          linkedRefs={linkedRefs}
          onToggleUploader={handleToggleUploader}
          onClose={onClose}
          />
      )}
    </>
  );
}

UploaderButton.propTypes = {
  children: PropTypes.node,
  linkedRefs: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
  onClose: PropTypes.func,
};

export default UploaderButton;
