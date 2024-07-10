import React from 'react';
import { SwitchField } from '@triniti/cms/components/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import withNotificationModal from '@triniti/cms/plugins/notify/components/create-notification-modal/withNotificationModal.js';

function BrowserNotificationModal() {
  return (
    <>
      <PicklistField picklist="browser-notification-fcm-topics" name="fcm_topics" label="FCM Topics" isMulti />
      <SwitchField name="require_interaction" label="Require Interaction" />
    </>
  );
}

export default withNotificationModal(BrowserNotificationModal);
