import React from 'react';
import { ModalBody } from 'reactstrap';
import CategoryPickerField from '@triniti/cms/plugins/taxonomy/components/category-picker-field/index.js';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal.js';

function CategoryTeaserModal() {
  return (
    <ModalBody>
      <CategoryPickerField name="target_ref" label="Target Category" required />
    </ModalBody>
  );
}

export default withTeaserModal(CategoryTeaserModal);
