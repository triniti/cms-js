import React from 'react';
import GalleryPickerField from '@triniti/cms/plugins/curator/components/gallery-picker-field/index.js';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal.js';

function GalleryTeaserModal() {
  return (
    <>
      <GalleryPickerField name="target_ref" label="Target Gallery" required />
    </>
  );
}

export default withTeaserModal(GalleryTeaserModal);
