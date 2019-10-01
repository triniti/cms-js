import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';
import filesize from 'filesize';
import {
  FormGroup,
  Label,
} from '@triniti/admin-ui-plugin/components';
import Message from '@gdbots/pbj/Message';
import damUrl from '../../utils/damUrl';

const Audio = ({ asset }) => (
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
        <ReactPlayer url={damUrl(asset)} width="100%" height="auto" controls />
      </div>
    </div>
  </div>
);

Audio.propTypes = {
  asset: PropTypes.instanceOf(Message).isRequired,
};

export default Audio;
