import React from 'react';
import { ModalBody } from 'reactstrap';
import AssetPickerField from '@triniti/cms/plugins/dam/components/asset-picker-field/index.js';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal.js';

function AssetTeaserModal() {
  return (
    <ModalBody>
      <AssetPickerField name="target_ref" label="Target Asset" required />
    </ModalBody>
  );
}

export default withTeaserModal(AssetTeaserModal);
