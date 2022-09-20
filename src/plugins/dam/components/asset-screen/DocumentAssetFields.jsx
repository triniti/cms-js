import React from 'react';
import { DatePickerField, TextareaField, TextField } from 'components';
import { Container, Col, Row } from 'reactstrap';
import humanizeBytes from 'utils/humanizeBytes';
import PicklistField from 'plugins/sys/components/picklist-field';

export default function DocumentAssetFields(props) {
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
      <TextField name="title" label="Title" />
      <PicklistField name="credit" label="Credit" picklist="document-asset-credits" />
      <DatePickerField name="expires_at" label="Expires At" />
      <TextareaField name="description" label="Description" />
    </>  
  );
}
