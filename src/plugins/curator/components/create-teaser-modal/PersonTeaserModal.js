import React from 'react';
import PersonPickerField from '@triniti/cms/plugins/people/components/person-picker-field/index.js';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal.js';

function PersonTeaserModal() {
  return (
    <>
      <PersonPickerField name="target_ref" label="Target Person" required />
    </>
  );
}

export default withTeaserModal(PersonTeaserModal);
