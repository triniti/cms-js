import React from 'react';
import { ModalBody } from 'reactstrap';
import ContentRefField from '@triniti/cms/plugins/notify/components/content-ref-field';
import SendOptionsField from '@triniti/cms/plugins/notify/components/send-options-field';
import withNotificationModal from '@triniti/cms/plugins/notify/components/create-notification-modal/withNotificationModal';

function AlexaNotificationModal(props) {
  const { articleStatus, contentRef } = props;
  return (
    <ModalBody>
      <ContentRefField contentRef={contentRef} />
      <SendOptionsField name="send_option" label="Send Options" articleStatus={articleStatus} />
    </ModalBody>
  );
}

export default withNotificationModal(AlexaNotificationModal);
