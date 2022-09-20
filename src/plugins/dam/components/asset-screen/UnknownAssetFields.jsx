import React from 'react';
import { Container, Col, Row } from 'reactstrap';
import { TextField } from 'components';
import humanizeBytes from 'utils/humanizeBytes';
import CommonFields from './CommonFields';

export default function UnknownAssetFields(props) {
  const { asset } = props  

  return (
    <>
      <Container fluid className="ui-cols">
        <Row>
          <Col xs="6 ps-0">
            <TextField name="mime_type" label="MIME type" readOnly />
            <TextField name="file_size" label="File size" format={humanizeBytes} readOnly />
          </Col>
        </Row>
      </Container>
      <CommonFields asset={asset} credit="unknown-asset-credits" />
    </>  
  );
}
