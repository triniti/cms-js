import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { FlatArrayField, TextField } from 'components';

export default function DetailsTab() {
  return (
    <Card>
      <CardHeader>Details</CardHeader>
      <CardBody className="pb-0">
        <TextField name="title" label="Title" readOnly required />
        <FlatArrayField name="allowed" label="Allowed" component={TextField} />
        <FlatArrayField name="denied" label="Denied" component={TextField} />
      </CardBody>
    </Card>
  );
}
