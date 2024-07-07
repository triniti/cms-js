import React from 'react';
import AssetPickerField from '@triniti/cms/plugins/dam/components/asset-picker-field/index.js';

export default function AudioAssetPickerField(props) {
  return (
    <AssetPickerField
      {...props}
      icon="audio"
      type="audio-asset"
      uploaderProps={{
        accept: ['application/*', 'audio/*'],
      }}
    />
  );
}
