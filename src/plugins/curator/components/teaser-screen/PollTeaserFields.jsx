import React from 'react';
import PollPickerField from 'plugins/apollo/components/poll-picker-field';

export default function PollTeaserFields() {
  return (
    <PollPickerField name="target_ref" label="Target Poll" readOnly />
  );
}
