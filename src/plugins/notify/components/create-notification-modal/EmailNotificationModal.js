import React from 'react';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import withNotificationModal from '@triniti/cms/plugins/notify/components/create-notification-modal/withNotificationModal.js';

function EmailNotificationModal() {
  return (
    <>
      <PicklistField picklist="email-notification-senders" name="sender" label="Sender" />
      <PicklistField picklist="email-notification-lists" name="lists" label="Lists" isMulti />
      <PicklistField picklist="email-notification-templates" name="template" label="Template" />
      <PicklistField picklist="email-notification-subjects" name="subject" label="Subject" />
    </>
  );
}

export default withNotificationModal(EmailNotificationModal);
