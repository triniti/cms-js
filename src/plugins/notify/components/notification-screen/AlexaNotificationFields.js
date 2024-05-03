import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { TextareaField } from 'components';
import ContentRefField from 'plugins/notify/components/content-ref-field';

export default function AlexaNotificationFields() {
  return (
    <>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <ContentRefField readOnly />
          <TextareaField name="body" label="Body" />
        </CardBody>
      </Card>
    </>
  );
}
