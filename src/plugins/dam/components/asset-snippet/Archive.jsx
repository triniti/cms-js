import { filesize } from 'filesize';
import PropTypes from 'prop-types';
import React from 'react';
import Message from '@gdbots/pbj/Message';
import { Icon } from 'components';
import {
  FormGroup,
  Label,
} from 'reactstrap';

const Archive = ({ asset }) => (
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
        <Icon imgSrc="archive" size="lg" />
      </div>
    </div>
  </div>
);

Archive.propTypes = {
  asset: PropTypes.instanceOf(Message).isRequired,
};

export default Archive;
