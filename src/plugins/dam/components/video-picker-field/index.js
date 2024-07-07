import React from 'react';
import AssetPickerField from '@triniti/cms/plugins/dam/components/asset-picker-field/index.js';

export default function VideoPickerField(props) {
  return (
    <AssetPickerField
      {...props}
      icon="video"
      type="video-asset"
      uploaderProps={{
        accept: ['application/*', 'video/*'],
      }}
    />
  );
}
