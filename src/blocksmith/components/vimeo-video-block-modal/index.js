import React from 'react';
import { SwitchField, TextareaField, TextField } from '@triniti/cms/components/index.js';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

function VimeoVideoBlockModal(props) {
  const { nodeRef: containerRef } = props.containerFormContext;
  return (
    <>
      <TextField name="id" label="Vimeo Video ID" required />
      <ImageAssetPickerField name="poster_image_ref" label="Poster Image" nodeRef={containerRef} />
      <TextField name="title" label="Title" />
      <TextareaField name="description" label="Description" rows={2} />
      <TextField name="user_id" label="User ID" />
      <TextField name="user_name" label="User Name" />
      <SwitchField name="autoplay" label="Autoplay" />
      <SwitchField name="loop" label="Loop" />
      <SwitchField name="show_byline" label="Show Byline" />
      <SwitchField name="show_portrait" label="Show Portrait" />
      <SwitchField name="show_title" label="Show Title" />
    </>
  );
}

export default withBlockModal(VimeoVideoBlockModal);
