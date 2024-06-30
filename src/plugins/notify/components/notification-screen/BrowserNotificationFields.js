import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { SwitchField } from '@triniti/cms/components/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';

export default function BrowserNotificationFields() {
  return (
    <Card>
      <CardHeader>Browser Configuration</CardHeader>
      <CardBody>
        <PicklistField picklist="browser-notification-fcm-topics" name="fcm_topics" label="FCM Topics" />
        <SwitchField name="require_interaction" label="Require Interaction" />
      </CardBody>
    </Card>
  );
}
