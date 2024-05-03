import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField } from 'components';
import PicklistField from 'plugins/sys/components/picklist-field';
import ContentRefField from 'plugins/notify/components/content-ref-field';
import SendOptionsField from 'plugins/notify/components/send-options-field';
import withNotificationModal from 'plugins/notify/components/create-notification-modal/withNotificationModal';

function BrowserNotificationModal(props) {
  const { articleStatus, contentRef } = props;
  return (
    <ModalBody>
      <ContentRefField contentRef={contentRef} />
      <SendOptionsField name="send_option" label="Send Options" articleStatus={articleStatus} />
      <PicklistField picklist="browser-notification-fcm-topics" name="fcm_topics" label="FCM Topics" isMulti />
      <SwitchField name="require_interaction" label="Require Interaction" />
    </ModalBody>
  );
}

export default withNotificationModal(BrowserNotificationModal);
