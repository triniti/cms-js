import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';

export default function IosNotificationFields() {
  return (
    <Card>
      <CardHeader>iOS Configuration</CardHeader>
      <CardBody>
        <PicklistField picklist="ios-notification-fcm-topics" name="fcm_topics" label="FCM Topics" />
      </CardBody>
    </Card>
  );
}
