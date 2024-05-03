import React from 'react';
import { Container, Col, Media, Row } from 'reactstrap';
import { TextField } from '@triniti/cms/components/index.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl';
import humanizeBytes from '@triniti/cms/utils/humanizeBytes';
import PollPickerField from '@triniti/cms/plugins/apollo/components/poll-picker-field';
import CommonFields from './CommonFields';

export default function ImageAssetFields(props) {
  const { asset, commonFieldsComponent } = props;
  const CommonFieldsComponent = commonFieldsComponent || CommonFields;

  const getDimensions = (value) => {
    return `${value} x ${asset.get('height')}`;
  }

  const previewUrl = damUrl(asset);

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
            {previewUrl && (
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                <Media src={previewUrl}
                  alt=""
                  width="100%"
                  height="auto"
                  object
                  className="rounded-2"
                />
              </a>
            )}
          </Col>
        </Row>
      </Container>
      <CommonFieldsComponent asset={asset} credit="image-asset-credits" {...props}  />
      <PollPickerField name="poll_ref" label="Search and Select a Poll" />
    </>
  );
}
