import React from 'react';
import { ModalBody } from 'reactstrap';
import ContentRefField from 'plugins/notify/components/content-ref-field';
import SendOptionsField from 'plugins/notify/components/send-options-field';
import withNotificationModal from 'plugins/notify/components/create-notification-modal/withNotificationModal';

function TwitterNotificationModal(props) {
  const { articleStatus } = props;
  return (
    <ModalBody>
      <ContentRefField />
      <SendOptionsField name="send_option" label="Send Options" articleStatus={articleStatus} />
    </ModalBody>
  );
}

export default withNotificationModal(TwitterNotificationModal);
