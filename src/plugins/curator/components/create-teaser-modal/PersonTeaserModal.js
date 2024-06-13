import React from 'react';
import { ModalBody } from 'reactstrap';
import PersonPickerField from '@triniti/cms/plugins/people/components/person-picker-field/index.js';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal.js';

function PersonTeaserModal() {
  return (
    <ModalBody>
      <PersonPickerField name="target_ref" label="Target Person" required />
    </ModalBody>
  );
}

export default withTeaserModal(PersonTeaserModal);
