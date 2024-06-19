import React from 'react';
import AssetPickerField from '@triniti/cms/plugins/dam/components/asset-picker-field/index.js';

export default function AssetTeaserFields() {
  return (
    <AssetPickerField name="target_ref" label="Target Asset" readOnly />
  );
}
