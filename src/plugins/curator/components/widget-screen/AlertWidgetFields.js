import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { SwitchField } from '@triniti/cms/components/index.js';

export default function AlertWidgetFields() {
  return (
    <Card>
      <CardHeader>Alert Widget Configuration</CardHeader>
      <CardBody>
        <SwitchField name="dismissible" label="Dismissible" />
      </CardBody>
    </Card>
  );
}
