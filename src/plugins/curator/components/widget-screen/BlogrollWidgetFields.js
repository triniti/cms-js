import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { TextField } from '@triniti/cms/components/index.js';

export default function BlogrollWidgetFields() {
  return (
    <Card>
      <CardHeader>Blogroll Widget Configuration</CardHeader>
      <CardBody>
        <TextField name="promotion_slot_prefix" label="Promotion Slot prefix" />
      </CardBody>
    </Card>
  );
}
