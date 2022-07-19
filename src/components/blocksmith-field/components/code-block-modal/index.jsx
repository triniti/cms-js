import React from 'react';
import { ModalBody } from 'reactstrap';
import { TextareaField } from 'components';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';

function CodeBlockModal() {
  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField name="code" label="Code" />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(CodeBlockModal);
