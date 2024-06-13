import React from 'react';
import { ModalBody } from 'reactstrap';
import { TextField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

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
