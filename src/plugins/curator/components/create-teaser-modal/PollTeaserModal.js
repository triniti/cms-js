import React from 'react';
import { ModalBody } from 'reactstrap';
import PollPickerField from '@triniti/cms/plugins/apollo/components/poll-picker-field/index.js';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal.js';

function PersonTeaserModal() {
  return (
    <ModalBody>
      <PollPickerField name="target_ref" label="Target Poll" required />
    </ModalBody>
  );
}

export default withTeaserModal(PersonTeaserModal);
