import React from 'react';
import { SwitchField, TextField } from '@triniti/cms/components/index.js';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

function SoundcloudAudioBlockModal(props) {
  const { nodeRef: containerRef } = props.containerFormContext;
  return (
    <>
      <TextField name="track_id" label="Soundcloud Track ID" required />
      <ImageAssetPickerField name="poster_image_ref" label="Poster Image" nodeRef={containerRef} />
      <SwitchField name="auto_play" label="Autoplay" />
      <SwitchField name="show_comments" label="Show Comments" />
      <SwitchField name="hide_related" label="Hide Related" />
      <SwitchField name="visual" label="Visual" />
    </>
  );
}

export default withBlockModal(SoundcloudAudioBlockModal);
