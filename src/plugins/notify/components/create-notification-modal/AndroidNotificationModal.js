import React from 'react';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import withNotificationModal from '@triniti/cms/plugins/notify/components/create-notification-modal/withNotificationModal.js';

function AndroidNotificationModal() {
  return (
    <>
      <PicklistField picklist="android-notification-fcm-topics" name="fcm_topics" label="FCM Topics" isMulti />
    </>
  );
}

export default withNotificationModal(AndroidNotificationModal);
