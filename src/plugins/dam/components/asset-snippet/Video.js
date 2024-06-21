import { Label, FormGroup } from 'reactstrap';
import artifactUrl from '@triniti/cms/plugins/ovp/artifactUrl.js';
import { filesize } from 'filesize';
import React from 'react';
import ReactPlayer from 'react-player';

const Video = ({ asset }) => (
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
        <ReactPlayer.default url={artifactUrl(asset, 'video')} width="100%" height="auto" controls />
      </div>
    </div>
  </div>
);

export default Video;
