import React from 'react';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field/index.js';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal.js';

// todo: review, should this be limited to images?  seems odd.
function AssetTeaserModal() {
  return (
    <>
      <ImageAssetPickerField name="target_ref" label="Target Asset" required />
    </>
  );
}

export default withTeaserModal(AssetTeaserModal);
