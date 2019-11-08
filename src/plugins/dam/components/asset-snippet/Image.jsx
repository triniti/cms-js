import filesize from 'filesize';
import PropTypes from 'prop-types';
import React from 'react';
import ReactImageMagnify from 'react-image-magnify';
import Message from '@gdbots/pbj/Message';
import { FormGroup, Label } from '@triniti/admin-ui-plugin/components';
import damUrl from '../../utils/damUrl';

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
      {previewUrl && (
        <div className="dam-media-container">
          <ReactImageMagnify
            smallImage={{
              src: previewUrl || damUrl(asset, 'o', 'sm'),
              isFluidWidth: true,
            }}
            imageStyle={{
              objectFit: 'contain',
            }}
            largeImage={{
              src: previewUrl || damUrl(asset, 'o'),
              width: (asset.get('width')),
              height: (asset.get('height')),
            }}
            enlargedImageContainerStyle={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              border: '0px',
              marginLeft: 0,
              maxHeight: '100vh',
              maxWidth: '100vw',
              transform: 'translate(-50%, -50%)',
              zIndex: 1049,
              pointerEvents: 'none',
            }}
            enlargedImagePosition="beside"
            enlargedImageContainerDimensions={{ width: '100%' }}
            enlargedImageContainerClassName="w-auto"
            enlargedImageStyle={{
              margin: '16px',
              border: '0px',
              maxHeight: 'calc(90vh)',
              maxWidth: 'calc(90vw)',
              filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.4)',
              objectFit: 'scale-down',
            }}
            enlargedImageClassName="h-100 w-auto asset-hover-mw"
          />
        </div>
      )}
    </div>
  </div>
);

Image.propTypes = {
  asset: PropTypes.instanceOf(Message).isRequired,
  previewUrl: PropTypes.string,
};

Image.defaultProps = {
  previewUrl: null,
};

export default Image;
