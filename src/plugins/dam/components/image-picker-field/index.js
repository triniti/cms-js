import React from 'react';
import { Media } from 'reactstrap';
import AssetPickerField from '@triniti/cms/plugins/dam/components/asset-picker-field/index.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';

function Preview(props) {
  const { assetRef } = props;
  const downloadUrl = damUrl(assetRef);
  const previewUrl = damUrl(assetRef, '1by1', 'sm');

  return (
    <div className="d-block">
      <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
        <Media src={previewUrl} alt="" width={200} height={200} object />
      </a>
    </div>
  );
}

export default function ImagePickerField(props) {
  return (
    <AssetPickerField
      {...props}
      Preview={Preview}
      icon="photo"
      type="image-asset"
      uploaderProps={{
        accept: ['image/gif', 'image/jpeg', 'image/png'],
      }}
    />
  );
}
