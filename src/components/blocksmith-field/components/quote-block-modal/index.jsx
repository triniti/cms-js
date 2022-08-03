import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField, TextField, UrlField } from 'components';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';

function QuoteBlockModal() {
  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField name="text" label="Text" placeholder="Enter the quoted text here" />
        <TextField name="source" label="Source" placeholder="Source" />
        <UrlField name="source_url" label="Source URL" placeholder="Source URL" />
        <SwitchField name="pull_quote" label="Pull Quote" editMode />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(QuoteBlockModal);
