import React from 'react';
import { ModalBody } from 'reactstrap';
import ChannelPickerField from '@triniti/cms/plugins/taxonomy/components/channel-picker-field';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal';

function ChannelTeaserModal() {
  return (
    <ModalBody>
      <ChannelPickerField name="target_ref" label="Target Channel" required />
    </ModalBody>
  );
}

export default withTeaserModal(ChannelTeaserModal);
