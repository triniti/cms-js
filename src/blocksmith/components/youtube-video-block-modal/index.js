import React from 'react';
import { NumberField, SwitchField, TextField } from '@triniti/cms/components/index.js';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';
import AsideField from '@triniti/cms/blocksmith/components/with-block-modal/AsideField.js';
import getYouTubeId from '@triniti/cms/utils/getYouTubeId.js';

function YoutubeVideoBlockModal(props) {
  const { nodeRef: containerRef } = props.containerFormContext;
  return (
    <>
      <TextField
        name="id"
        label="YouTube Video ID"
        parse={getYouTubeId}
        required
        placeholder="Paste in a YouTube URL or Video ID"
      />
      <SwitchField name="autoplay" label="Autoplay" />
      <NumberField name="start_at" label="Start At" description="Measured in seconds." />
      <ImageAssetPickerField name="poster_image_ref" label="Poster Image" nodeRef={containerRef} />
      <AsideField />
    </>
  );
}

export default withBlockModal(YoutubeVideoBlockModal);
