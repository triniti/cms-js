import React from 'react';
import AssetPickerField from '@triniti/cms/plugins/dam/components/asset-picker-field/index.js';

export default (props) => (
  <AssetPickerField
    assetType="document-asset"
    searchQ="-mime_type:application/pdf"
    clearButtonTxt="Clear Document"
    selectButtonTxt="Select a Document"
    selectNewButtonTxt="Select a New Document"
    displayTitle={true}
    previewImage={false}
    modalTitle="Select a Document"
    uploaderProps={
      {
        allowedMimeTypes: ['text/plain', 'text/vtt', 'text/srt'],
        allowMultiUpload: false,
      }
    }
    {...props}
  />
)