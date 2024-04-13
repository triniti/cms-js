import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField } from '@triniti/cms/components';
import withBlockModal from '@triniti/cms/components/blocksmith-field/components/with-block-modal';

function EmeFormBlockModal() {
  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField name="form_ref" label="Enter EME Form Ref" placeholder="eme:solicit:id" />
        <SwitchField name="expires_at" label="Has expiration date" />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(EmeFormBlockModal);
