import React from 'react';
import { TextField } from '@triniti/cms/components/index.js';
import PollPickerField from '@triniti/cms/plugins/apollo/components/poll-picker-field/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

function PollBlockModal() {
  return (
    <>
      <PollPickerField name="node_ref" label="Poll" required />
      <TextField name="title" label="Custom Title" description="When not set, the poll's title will be used." />
    </>
  );
}

export default withBlockModal(PollBlockModal);
