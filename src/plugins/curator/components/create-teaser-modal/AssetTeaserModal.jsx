import React from 'react';
import { ModalBody } from 'reactstrap';
import ImagePickerField from 'plugins/dam/components/image-picker-field';
import withTeaserModal from 'plugins/curator/components/create-teaser-modal/withTeaserModal';

function AssetTeaserModal() {
  return (
    <ModalBody>
      <ImagePickerField name="target_ref" label="Target Asset" required />
    </ModalBody>
  );
}

export default withTeaserModal(AssetTeaserModal);
