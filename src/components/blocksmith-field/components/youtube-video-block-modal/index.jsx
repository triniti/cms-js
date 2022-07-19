import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField, TextField } from 'components';
import getYouTubeId from 'utils/getYouTubeId';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';

function YoutubeVideoBlockModal() {
  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField name="id" label="URL" placeholder="enter url or embed code" parse={getYouTubeId} />
        <TextField name="start_at" label="Start At ( In Seconds )" value="0" />
        {/* fixme: add image picker when it's ready */}
        <SwitchField name="autoplay" label="Autoplay" />
        <SwitchField name="aside" label="Aside" />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(YoutubeVideoBlockModal);