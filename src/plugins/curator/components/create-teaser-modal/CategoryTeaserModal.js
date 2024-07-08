import React from 'react';
import CategoryPickerField from '@triniti/cms/plugins/taxonomy/components/category-picker-field/index.js';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal.js';

function CategoryTeaserModal() {
  return (
    <>
      <CategoryPickerField name="target_ref" label="Target Category" required />
    </>
  );
}

export default withTeaserModal(CategoryTeaserModal);
