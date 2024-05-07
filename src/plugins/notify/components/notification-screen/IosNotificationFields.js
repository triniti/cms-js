import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { TextareaField, TextField, SwitchField } from '@triniti/cms/components/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import ContentRefField from '@triniti/cms/plugins/notify/components/content-ref-field/index.js';

export default function IosNotificationFields() {
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
          <PicklistField picklist="ios-notification-fcm-topics" name="fcm_topics" label="FCM Topics" />
          <SwitchField name="require_interaction" label="Require Interaction" />
        </CardBody>
      </Card>
    </>
  );
}
