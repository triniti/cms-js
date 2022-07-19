import React from 'react';
import { ModalBody } from 'reactstrap';
import GalleryPickerField from 'plugins/curator/components/gallery-picker-field';
import withTeaserModal from 'plugins/curator/components/create-teaser-modal/withTeaserModal';

function GalleryTeaserModal() {
  return (
    <ModalBody>
      <GalleryPickerField name="target_ref" label="Target Gallery" required />
    </ModalBody>
  );
}

export default withTeaserModal(GalleryTeaserModal);
