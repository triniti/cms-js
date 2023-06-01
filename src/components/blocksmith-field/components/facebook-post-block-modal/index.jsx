import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField } from 'components';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';

function FacebookPostBlockModal() {
  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField name="href" label="URL" placeholder="enter url or embed code" />
        <SwitchField name="show_text" label="Show Text" />
        <SwitchField name="aside" label="Aside" tooltip="Is only indirectly related to the main content." />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(FacebookPostBlockModal);
