import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { TextareaField } from '@triniti/cms/components/index.js';
import ContentRefField from '@triniti/cms/plugins/notify/components/content-ref-field/index.js';

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