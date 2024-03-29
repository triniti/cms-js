import React from 'react';
import { ModalBody } from 'reactstrap';
import PicklistField from 'plugins/sys/components/picklist-field';
import ContentRefField from 'plugins/notify/components/content-ref-field';
import SendOptionsField from 'plugins/notify/components/send-options-field';
import withNotificationModal from 'plugins/notify/components/create-notification-modal/withNotificationModal';

function AndroidNotificationModal(props) {
  const { articleStatus, contentRef } = props;
  
  return (
    <ModalBody>
      <ContentRefField contentRef={contentRef} />
      <SendOptionsField name="send_option" label="Send Options" articleStatus={articleStatus} />
      <PicklistField picklist="android-notification-fcm-topics" name="fcm_topics" label="FCM Topics" isMulti />
    </ModalBody>
  );
}

export default withNotificationModal(AndroidNotificationModal);
