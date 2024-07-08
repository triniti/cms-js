import React from 'react';
import PollPickerField from '@triniti/cms/plugins/apollo/components/poll-picker-field/index.js';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal.js';

function PollTeaserModal() {
  return (
    <>
      <PollPickerField name="target_ref" label="Target Poll" required />
    </>
  );
}

export default withTeaserModal(PollTeaserModal);
