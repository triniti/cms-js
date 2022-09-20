import React from 'react';
import { Container, Col, Media, Row } from 'reactstrap';
import humanizeBytes from 'utils/humanizeBytes';
import { TextField } from 'components';
import damUrl from 'plugins/dam/damUrl';
import PollPickerField from 'plugins/apollo/components/poll-picker-field';
import CommonFields from './CommonFields';

export default function ImageAssetFields(props) {
  const { asset } = props

  const getDimensions = (value) => {
    return `${value} x ${asset.get('height')}`;
  }

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
            <Media
              src={damUrl(asset, '1by1', 'xs', null)} // todo: react maginfier
              alt=""
              width="200"
              height="auto"
              object
              className="rounded-2"
            />
          </Col>
        </Row>
      </Container>
      <CommonFields asset={asset} credit="image-asset-credits" />
      <PollPickerField name="polls" label="Search and Select a Poll" />
    </>  
  );
}
