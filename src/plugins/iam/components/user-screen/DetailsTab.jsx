import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { EmailField, SwitchField, TextField } from '@triniti/cms/components';
import TaggableFields from '@triniti/cms/plugins/common/components/taggable-fields';

export default function DetailsTab() {
  return (
    <>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <TextField name="title" label="Display Name" required />
          <TextField name="first_name" label="First Name" />
          <TextField name="last_name" label="Last Name" />
          <EmailField name="email" label="Email" readOnly />
          <SwitchField name="is_staff" label="Is Staff?" />
          <SwitchField name="is_blocked" label="Is Blocked?" />
        </CardBody>
      </Card>
      <TaggableFields />
    </>
  );
}
