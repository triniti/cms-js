import React from 'react';
import { useFormState } from 'react-final-form';
import { SwitchField, TextField } from '@triniti/cms/components/index.js';
import AspectRatioField from '@triniti/cms/plugins/common/components/aspect-ratio-field/index.js';
import GalleryPickerField from '@triniti/cms/plugins/curator/components/gallery-picker-field/index.js';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';
import AsideField from '@triniti/cms/blocksmith/components/with-block-modal/AsideField.js';

function GalleryBlockModal(props) {
  const { nodeRef: containerRef } = props.containerFormContext;
  const { values } = useFormState({ subscription: { values: true } });
  return (
    <>
      <GalleryPickerField name="node_ref" label="Gallery" required />
      <ImageAssetPickerField
        name="poster_image_ref"
        label="Poster Image"
        description="When not set, the gallery's image will be used."
        nodeRef={containerRef}
        galleryRef={values.node_ref}
      />
      <SwitchField
        name="start_at_poster"
        label="Start At Poster"
        description="This only works when the poster image is in the selected gallery."
      />
      <AspectRatioField />
      <TextField name="title" label="Custom Title" description="When not set, the gallery's title will be used." />
      <TextField name="launch_text" label="Launch Text" description="When not set, the gallery's launch text will be used." />
      <AsideField />
    </>
  );
}

export default withBlockModal(GalleryBlockModal);
