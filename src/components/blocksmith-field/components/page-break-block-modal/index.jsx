import React from 'react';
import { ModalBody } from 'reactstrap';
import { TextField } from 'components';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';

function PageBreakBlockModal() {
  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextField name="read_more_text" label="Read More Text" placeholder="Enter the read more text here" />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(PageBreakBlockModal);
