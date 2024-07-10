import React from 'react';
import { Media } from 'reactstrap';
import AssetPickerField from '@triniti/cms/plugins/dam/components/asset-picker-field/index.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';

function Preview(props) {
  const { assetRef } = props;
  const downloadUrl = damUrl(assetRef);
  const previewUrl = damUrl(assetRef, '1by1', 'sm');

  return (
    <div className="d-block mb-3">
      <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="hover-box-shadow d-inline-block rounded-3">
        <Media src={previewUrl} alt="" width={200} height={200} object className="rounded-3" />
      </a>
    </div>
  );
}

export default function ImageAssetPickerField(props) {
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
