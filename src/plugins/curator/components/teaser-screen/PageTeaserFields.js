import React from 'react';
import PagePickerField from '@triniti/cms/plugins/canvas/components/page-picker-field/index.js';

export default function PageTeaserFields() {
  return (
    <PagePickerField name="target_ref" label="Target Page" required readOnly />
  );
}
