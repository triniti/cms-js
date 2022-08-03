import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField } from 'components';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';

function VimeoVideoBlockModal() {
  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField name="id" label="Track Id" placeholder="enter url or embed code" />
        <SwitchField name="autoplay" label="Autoplay" />
        <SwitchField name="loop" label="Loop" />
        <SwitchField name="show_byline" label="Show Byline in Overlay" />
        <SwitchField name="show_portrait" label="Show Portrait in Overlay" />
        <SwitchField name="show_title" label="Show Title in Overlay" />
        <SwitchField name="aside" label="Aside" />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(VimeoVideoBlockModal);
