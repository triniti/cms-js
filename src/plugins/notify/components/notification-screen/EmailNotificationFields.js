import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';

export default function EmailNotificationFields() {
  return (
    <Card>
      <CardHeader>Email Configuration</CardHeader>
      <CardBody>
        <PicklistField picklist="email-notification-senders" name="sender" label="Sender" required />
        <PicklistField picklist="email-notification-lists" name="lists" label="Lists" isMulti  />
        <PicklistField picklist="email-notification-templates" name="template" label="Template" required />
        <PicklistField picklist="email-notification-subjects" name="subject" label="Subject" required />
      </CardBody>
    </Card>
  );
}
