import React from 'react';
import ChannelPickerField from '@triniti/cms/plugins/taxonomy/components/channel-picker-field/index.js';

export default function ChannelTeaserFields() {
  return (
    <ChannelPickerField name="target_ref" label="Target Channel" required readOnly />
  );
}
