import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField } from 'components';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';

const TRACK_ID_REGEX = /api\.soundcloud\.com\/tracks\/\d+/;

const validator = (value) => {
  if (!TRACK_ID_REGEX.test(value)) {
    return 'url or embed code is invalid.';
  }

  return undefined;
};

function SoundcloudAudioBlockModal() {
  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField
          name="track_id"
          label="Track ID"
          placeholder="enter embed code"
          validator={validator}
          required
        />
        <SwitchField name="auto_play" label="Autoplay" />
        <SwitchField name="visual" label="Visual Overlay" />
        <SwitchField name="hide_related" label="Hide Related" />
        <SwitchField name="show_comments" label="Show Comments" />
        <SwitchField name="aside" label="Aside" tooltip="Is only indirectly related to the main content." />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(SoundcloudAudioBlockModal);
