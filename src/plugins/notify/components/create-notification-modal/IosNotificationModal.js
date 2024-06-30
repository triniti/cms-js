import React from 'react';
import { ModalBody } from 'reactstrap';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import ContentRefField from '@triniti/cms/plugins/notify/components/content-ref-field/index.js';
import SendOptionsField from '@triniti/cms/plugins/notify/components/send-options-field/index.js';
import withNotificationModal from '@triniti/cms/plugins/notify/components/create-notification-modal/withNotificationModal.js';

function IosNotificationModal(props) {
  const { contentStatus, contentRef } = props;
  return (
    <ModalBody>
      <ContentRefField contentRef={contentRef} />
      <SendOptionsField name="send_option" label="Send Options" contentStatus={contentStatus} />
      <PicklistField picklist="ios-notification-fcm-topics" name="fcm_topics" label="FCM Topics" isMulti />
    </ModalBody>
  );
}

export default withNotificationModal(IosNotificationModal);
