import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { TextareaField, TextField } from 'components';
import PicklistField from 'plugins/sys/components/picklist-field';
import ContentRefField from 'plugins/notify/components/content-ref-field';

export default function AndroidNotificationFields() {
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
          <PicklistField picklist="android-notification-fcm-topics" name="fcm_topics" label="FCM Topics" isMulti />
        </CardBody>
      </Card>
    </>
  );
}
