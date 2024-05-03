import React from 'react';
import { Container, Col, Row } from 'reactstrap';
import { TextField } from '@triniti/cms/components/index.js';
import humanizeBytes from '@triniti/cms/utils/humanizeBytes';
import CommonFields from './CommonFields';

export default function CodeAssetFields(props) {
  const { asset, commonFieldsComponent } = props;
  const CommonFieldsComponent = commonFieldsComponent || CommonFields;

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
      <CommonFieldsComponent asset={asset} credit="code-asset-credits" {...props}  />
    </>
  );
}
