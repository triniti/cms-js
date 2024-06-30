import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { TextField } from '@triniti/cms/components/index.js';

export default function AppleNewsNotificationFields() {
  return (
    <Card>
      <CardHeader>Apple News Configuration</CardHeader>
      <CardBody>
        <TextField name="apple_news_operation" label="Apple News Operation" readOnly />
        <TextField name="apple_news_id" label="Apple News ID" readOnly />
        <TextField name="apple_news_revision" label="Apple News Revision" readOnly />
      </CardBody>
    </Card>
  );
}
