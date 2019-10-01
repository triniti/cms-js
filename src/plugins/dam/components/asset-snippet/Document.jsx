import React from 'react';
import PropTypes from 'prop-types';
import filesize from 'filesize';
import {
  Icon,
  FormGroup,
  Label,
} from '@triniti/admin-ui-plugin/components';
import Message from '@gdbots/pbj/Message';

const Document = (props) => {
  const { asset } = props;

  return (
    <div className="row">
      <div className="col-12 col-md-6">
        <FormGroup className="mb-3">
          <Label>MIME type</Label>
          <span className="form-control-sm form-control" readOnly>{asset.get('mime_type')}</span>
        </FormGroup>
        <FormGroup className="mb-3">
          <Label>Size</Label>
          <span className="form-control-sm form-control" readOnly>{filesize(asset.get('file_size'))}</span>
        </FormGroup>
      </div>
      <div className="col-12 col-md-6">
        <div className="dam-media-container">
          <Icon imgSrc="document" size="xl" />
        </div>
      </div>
    </div>
  );
};

Document.propTypes = {
  asset: PropTypes.instanceOf(Message).isRequired,
};

export default Document;
