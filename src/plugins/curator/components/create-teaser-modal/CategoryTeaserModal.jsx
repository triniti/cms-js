import React from 'react';
import { ModalBody } from 'reactstrap';
import CategoryPickerField from 'plugins/taxonomy/components/category-picker-field';
import withTeaserModal from 'plugins/curator/components/create-teaser-modal/withTeaserModal';

function CategoryTeaserModal() {
  return (
    <ModalBody>
      <CategoryPickerField name="target_ref" label="Target Category" required />
    </ModalBody>
  );
}

export default withTeaserModal(CategoryTeaserModal);
