import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { TextareaField } from 'components';
import ContentRefField from 'plugins/notify/components/content-ref-field';

export default function TwitterNotificationFields() {
  return (
    <>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <ContentRefField />
          <TextareaField name="body" label="Tweet Text" />
        </CardBody>
      </Card>
    </>
  );
}
