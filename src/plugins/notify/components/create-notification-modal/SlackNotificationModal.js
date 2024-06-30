import React from 'react';
import { ModalBody } from 'reactstrap';
import ContentRefField from '@triniti/cms/plugins/notify/components/content-ref-field/index.js';
import SendOptionsField from '@triniti/cms/plugins/notify/components/send-options-field/index.js';
import withNotificationModal from '@triniti/cms/plugins/notify/components/create-notification-modal/withNotificationModal.js';

function SlackNotificationModal(props) {
  const { contentStatus, contentRef } = props;
  return (
    <ModalBody>
      <ContentRefField contentRef={contentRef} />
      <SendOptionsField name="send_option" label="Send Options" contentStatus={contentStatus} />
    </ModalBody>
  );
}

export default withNotificationModal(SlackNotificationModal);
