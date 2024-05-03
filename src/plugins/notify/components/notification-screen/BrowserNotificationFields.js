import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { SwitchField, TextareaField, TextField } from 'components';
import PicklistField from 'plugins/sys/components/picklist-field';
import ContentRefField from 'plugins/notify/components/content-ref-field';

export default function BrowserNotificationFields() {
  return (
    <>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <TextField name="title" label="Title" required />
          <ContentRefField readOnly />
          <TextareaField name="body" label="Body" />
        </CardBody>
      </Card>
      <Card>
        <CardHeader>Notification Options</CardHeader>
        <CardBody>
          <PicklistField picklist="browser-notification-fcm-topics" name="fcm_topics" label="FCM Topics" />
          <SwitchField name="require_interaction" label="Require Interaction" />
        </CardBody>
      </Card>
    </>
  );
}
