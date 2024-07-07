import React from 'react';
import AssetPickerField from '@triniti/cms/plugins/dam/components/asset-picker-field/index.js';

export default function DocumentPickerField(props) {
  return (
    <AssetPickerField
      {...props}
      icon="document"
      type="document-asset"
      uploaderProps={{
        accept: ['application/*', 'text/*'],
      }}
    />
  );
}
