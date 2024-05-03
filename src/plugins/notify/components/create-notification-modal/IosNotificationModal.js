import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField } from '@triniti/cms/components/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field';
import ContentRefField from '@triniti/cms/plugins/notify/components/content-ref-field';
import SendOptionsField from '@triniti/cms/plugins/notify/components/send-options-field';
import withNotificationModal from '@triniti/cms/plugins/notify/components/create-notification-modal/withNotificationModal';

function IosNotificationModal(props) {
  const { articleStatus, contentRef } = props;
  return (
    <ModalBody>
      <ContentRefField contentRef={contentRef} />
      <SendOptionsField name="send_option" label="Send Options" articleStatus={articleStatus} />
      <PicklistField picklist="ios-notification-fcm-topics" name="fcm_topics" label="FCM Topics" isMulti />
      <SwitchField name="require_interaction" label="Require Interaction" />
    </ModalBody>
  );
}

export default withNotificationModal(IosNotificationModal);
