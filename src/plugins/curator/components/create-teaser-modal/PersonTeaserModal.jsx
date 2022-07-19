import React from 'react';
import { ModalBody } from 'reactstrap';
import PersonPickerField from 'plugins/people/components/person-picker-field';
import withTeaserModal from 'plugins/curator/components/create-teaser-modal/withTeaserModal';

function PersonTeaserModal() {
  return (
    <ModalBody>
      <PersonPickerField name="target_ref" label="Target Person" required />
    </ModalBody>
  );
}

export default withTeaserModal(PersonTeaserModal);
