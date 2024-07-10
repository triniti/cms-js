import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';

export default function AndroidNotificationFields() {
  return (
    <Card>
      <CardHeader>Android Configuration</CardHeader>
      <CardBody>
        <PicklistField picklist="android-notification-fcm-topics" name="fcm_topics" label="FCM Topics" isMulti />
      </CardBody>
    </Card>
  );
}
