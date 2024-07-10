import React from 'react';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field/index.js';

export default function AssetTeaserFields() {
  return (
    <ImageAssetPickerField name="target_ref" label="Target Asset" required readOnly />
  );
}
