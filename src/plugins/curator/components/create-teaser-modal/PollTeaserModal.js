import React from 'react';
import { ModalBody } from 'reactstrap';
import PollPickerField from '@triniti/cms/plugins/apollo/components/poll-picker-field';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal';

function PersonTeaserModal() {
  return (
    <ModalBody>
      <PollPickerField name="target_ref" label="Target Poll" required />
    </ModalBody>
  );
}

export default withTeaserModal(PersonTeaserModal);
