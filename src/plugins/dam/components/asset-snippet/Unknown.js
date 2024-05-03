import React from 'react';
import PropTypes from 'prop-types';
import { filesize } from 'filesize';
import { Icon } from '@triniti/cms/components/index.js';
import {
  FormGroup,
  Label,
} from 'reactstrap';
import Message from '@gdbots/pbj/Message';

const Unknown = (props) => {
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
          <Icon imgSrc="unknown" size="xl" />
        </div>
      </div>
    </div>
  );
};

Unknown.propTypes = {
  asset: PropTypes.instanceOf(Message).isRequired,
};

export default Unknown;
