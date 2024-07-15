import React from 'react';
import { NumberField, SwitchField, TextField } from '@triniti/cms/components/index.js';
import VideoPickerField from '@triniti/cms/plugins/ovp/components/video-picker-field/index.js';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

function VideoBlockModal(props) {
  const { nodeRef: containerRef } = props.containerFormContext;
  return (
    <>
      <VideoPickerField name="node_ref" label="Video" required />
      <SwitchField name="autoplay" label="Autoplay" />
      <SwitchField name="muted" label="Muted" />
      <NumberField name="start_at" label="Start At" description="Measured in seconds." />
      <ImageAssetPickerField name="poster_image_ref" label="Poster Image" nodeRef={containerRef} />
      <TextField name="title" label="Custom Title" description="When not set, the videos's title will be used." />
      <TextField name="launch_text" label="Launch Text" />
      <SwitchField name="show_more_videos" label="Show More Videos" />
    </>
  );
}

export default withBlockModal(VideoBlockModal);
