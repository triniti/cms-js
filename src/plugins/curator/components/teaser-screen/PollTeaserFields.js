import React from 'react';
import PollPickerField from '@triniti/cms/plugins/apollo/components/poll-picker-field/index.js';

export default function PollTeaserFields() {
  return (
    <PollPickerField name="target_ref" label="Target Poll" required readOnly />
  );
}
