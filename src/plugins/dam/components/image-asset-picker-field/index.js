import React from 'react';
import { Media } from 'reactstrap';
import AssetPickerField from '@triniti/cms/plugins/dam/components/asset-picker-field/index.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';

function Preview(props) {
  const { assetRef, launchText = '' } = props;
  const downloadUrl = damUrl(assetRef);
  const previewUrl = damUrl(assetRef, '1by1', 'sm');

  return (
    <div className="d-block mb-3">
      <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="hover-box-shadow d-inline-block rounded-3 overflow-hidden position-relative">
        <Media src={previewUrl} alt="" width={200} height={200} object className="rounded-3" />
        {launchText && (
          <div className="position-absolute bottom-0 start-0 end-0 px-2 py-1 text-white text-break text-uppercase bg-black bg-opacity-75 lh-sm">
            {launchText}
          </div>
        )}
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
