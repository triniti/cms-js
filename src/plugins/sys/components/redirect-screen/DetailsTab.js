import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { SwitchField, UriField } from '@triniti/cms/components/index.js';

export default function DetailsTab() {
  return (
    <Card>
      <CardHeader>Details</CardHeader>
      <CardBody>
        <UriField name="title" label="Request URI" readOnly required />
        <UriField name="redirect_to" label="Redirect URI" required />
        <SwitchField name="is_vanity" label="Is Vanity URL?" />
        <SwitchField name="is_permanent" label="Is Permanent?" />
      </CardBody>
    </Card>
  );
}
