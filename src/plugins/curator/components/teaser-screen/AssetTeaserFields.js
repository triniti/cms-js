import React from 'react';
import ImagePickerField from '@triniti/cms/plugins/dam/components/image-picker-field/index.js';

export default function AssetTeaserFields() {
  return (
    <ImagePickerField name="target_ref" label="Target Asset" required readOnly />
  );
}
