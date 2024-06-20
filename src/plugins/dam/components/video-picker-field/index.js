import React from 'react';
import AssetPickerField from '@triniti/cms/plugins/dam/components/asset-picker-field/index.js';
export default (props) => (
  <AssetPickerField 
    assetType="video-asset"
    clearButtonTxt="Clear Video"
    selectButtonTxt="Select a Video"
    selectNewButtonTxt="Select a New Video"
    modalTitle="Select a Video"
    displayTitle={true}
    previewImage={false}
    uploaderProps={
      {
        allowedMimeTypes: ['application/mxf', 'video/x-flv', 'video/mp4', 'video/webm'],
        allowMultiUpload: false,
      }
    }
    {...props}
  />
);