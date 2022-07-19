import React from 'react';
import ImagePickerField from 'plugins/dam/components/image-picker-field';

export default function AssetTeaserFields() {
  return (
    <ImagePickerField name="target_ref" label="Target Asset" readOnly />
  );
}
