import React from 'react';
import { ModalBody } from 'reactstrap';
import PicklistField from 'plugins/sys/components/picklist-field';
import ContentRefField from 'plugins/notify/components/content-ref-field';
import SendOptionsField from 'plugins/notify/components/send-options-field';
import withNotificationModal from 'plugins/notify/components/create-notification-modal/withNotificationModal';

function EmailNotificationModal(props) {
  const { articleStatus, contentRef } = props;
  return (
    <ModalBody>
      <ContentRefField contentRef={contentRef} />
      <SendOptionsField name="send_option" label="Send Options" articleStatus={articleStatus} />
      <PicklistField picklist="email-notification-templates" name="template" label="Template" />
      <PicklistField picklist="email-notification-subjects" name="subject" label="Subject" />
    </ModalBody>
  );
}

export default withNotificationModal(EmailNotificationModal);
