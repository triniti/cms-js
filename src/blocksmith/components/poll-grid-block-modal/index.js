import React from 'react';
import PollPickerField from '@triniti/cms/plugins/apollo/components/poll-picker-field/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

function PollGridBlockModal() {
  return (
    <>
      <PollPickerField name="node_refs" label="Polls" required isMulti sortable />
    </>
  );
}

export default withBlockModal(PollGridBlockModal);
