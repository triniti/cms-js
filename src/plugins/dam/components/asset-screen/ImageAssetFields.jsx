import React from 'react';
import ReactImageMagnify from 'react-image-magnify';
import { Container, Col, Row, Spinner } from 'reactstrap';
import { TextField } from 'components';
import damUrl from 'plugins/dam/damUrl';
import humanizeBytes from 'utils/humanizeBytes';
import PollPickerField from 'plugins/apollo/components/poll-picker-field';
import CommonFields from './CommonFields';

export default function ImageAssetFields({ asset }) {
  const getDimensions = (value) => {
    return `${value} x ${asset.get('height')}`;
  }

  const previewUrl = damUrl(asset, 'o');

  return (
    <>
      <Container fluid className="ui-cols">
        <Row>
          <Col xs="6 ps-0">
            <TextField name="mime_type" label="MIME type" readOnly />
            <TextField name="file_size" label="File size" format={humanizeBytes} readOnly />
            <TextField name="width" label="Dimensions" format={getDimensions} readOnly />
          </Col>
          <Col xs="6 pe-0">
            {!previewUrl && <Spinner centered />}
            {previewUrl && (
                <ReactImageMagnify
                  smallImage={{
                    src: previewUrl,
                    isFluidWidth: true,
                  }}
                  imageStyle={{
                    objectFit: 'contain',
                  }}
                  largeImage={{
                    src: previewUrl,
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
            )}
          </Col>
        </Row>
      </Container>
      <CommonFields asset={asset} credit="image-asset-credits" />
      <PollPickerField name="polls" label="Search and Select a Poll" />
    </>
  );
}
