import React from 'react';
import { ModalBody } from 'reactstrap';
import PagePickerField from '@triniti/cms/plugins/canvas/components/page-picker-field';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal';

function PageTeaserModal() {
  return (
    <ModalBody>
      <PagePickerField name="target_ref" label="Target Page" required />
    </ModalBody>
  );
}

export default withTeaserModal(PageTeaserModal);
