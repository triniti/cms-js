import React from 'react';
import TimelinePickerField from '@triniti/cms/plugins/curator/components/timeline-picker-field/index.js';

export default function TimelineTeaserFields() {
  return (
    <TimelinePickerField name="target_ref" label="Target Timeline" required readOnly />
  );
}
