import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField } from 'components';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';

function SpotifyTrackBlockModal() {
  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField name="track_id" label="Embed code, Link, URI, or track id" placeholder="enter embed code" />
        <SwitchField name="aside" label="Aside" tooltip="Is only indirectly related to the main content." />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(SpotifyTrackBlockModal);
