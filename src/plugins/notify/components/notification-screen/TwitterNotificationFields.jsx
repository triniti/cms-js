import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { TextareaField } from '@triniti/cms/components';
import ContentRefField from '@triniti/cms/plugins/notify/components/content-ref-field';

export default function TwitterNotificationFields() {
  return (
    <>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <ContentRefField readOnly />
          <TextareaField name="body" label="Tweet Text" />
        </CardBody>
      </Card>
    </>
  );
}
