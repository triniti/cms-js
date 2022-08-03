import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField } from 'components';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';

function FacebookVideoBlockModal() {
  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField name="href" label="URL" placeholder="enter url or embed code" />
        <SwitchField name="autoplay" label="Autoplay" />
        <SwitchField name="show_captions" label="Show Captions" />
        <SwitchField name="show_text" label="Show Text" />
        <SwitchField name="aside" label="Aside" />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(FacebookVideoBlockModal);
