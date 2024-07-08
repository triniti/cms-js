import React from 'react';
import PagePickerField from '@triniti/cms/plugins/canvas/components/page-picker-field/index.js';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal.js';

function PageTeaserModal() {
  return (
    <>
      <PagePickerField name="target_ref" label="Target Page" required />
    </>
  );
}

export default withTeaserModal(PageTeaserModal);
