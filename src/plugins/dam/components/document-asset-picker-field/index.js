import React from 'react';
import AssetPickerField from '@triniti/cms/plugins/dam/components/asset-picker-field/index.js';

export default function DocumentAssetPickerField(props) {
  return (
    <AssetPickerField
      {...props}
      icon="document"
      type="document-asset"
      searchEnricher={req => req.set('q', req.get('q', '') + ' -mime_type:(text/srt OR text/vtt)')}
      uploaderProps={{
        accept: ['application/*', 'text/*'],
      }}
    />
  );
}
