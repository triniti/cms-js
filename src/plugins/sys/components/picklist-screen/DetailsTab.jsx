import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { FlatArrayField, SwitchField, TextField } from '@triniti/cms/components';

export default function DetailsTab() {
  return (
    <Card>
      <CardHeader>Details</CardHeader>
      <CardBody className="pb-0">
        <TextField name="title" label="Title" readOnly required />
        <SwitchField name="alpha_sort" label="Sort Alphabetically?" />
        <SwitchField name="allow_other" label="Allow Other?" />
        <TextField name="default_value" label="Default Value" />
        <FlatArrayField name="options" label="Options" component={TextField} />
      </CardBody>
    </Card>
  );
}
