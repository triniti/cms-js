import React from 'react';
import { filesize } from 'filesize';
import { Icon } from '@triniti/cms/components/index.js';
import {
  FormGroup,
  Label,
} from 'reactstrap';

const Code = (props) => {
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
          <Icon imgSrc="code" size="xl" />
        </div>
      </div>
    </div>
  );
};

export default Code;
