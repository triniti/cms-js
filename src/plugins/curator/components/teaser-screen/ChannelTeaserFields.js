import React from 'react';
import ChannelPickerField from '@triniti/cms/plugins/taxonomy/components/channel-picker-field';

export default function ChannelTeaserFields() {
  return (
    <ChannelPickerField name="target_ref" label="Target Channel" readOnly />
  );
}
