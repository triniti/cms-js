import React from 'react';
import { DatePickerField, TextareaField, TextField } from '@triniti/cms/components/index.js';
import { Container, Col, Row } from 'reactstrap';
import humanizeBytes from '@triniti/cms/utils/humanizeBytes.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';

export default function DocumentAssetFields() {
  return <>
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
};
