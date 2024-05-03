import { filesize } from 'filesize';
import React from 'react';
import { FormGroup, Label, Spinner } from 'reactstrap';

const Image = ({ asset, previewUrl }) => (
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
      <FormGroup className="mb-3">
        <Label for="dam-dimensions">Dimensions</Label>
        <span className="form-control-sm form-control" readOnly>{`${asset.get('width')}x${asset.get('height')}`}</span>
      </FormGroup>
    </div>
    <div className="col-12 col-md-6">
      {!previewUrl && <Spinner centered />}

      {previewUrl && (
      <div className="dam-media-container">
        <img src={previewUrl} />
      </div>
      )}
    </div>
  </div>
);

export default Image;
