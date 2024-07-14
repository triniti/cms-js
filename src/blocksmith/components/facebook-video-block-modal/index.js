import React from 'react';
import { SwitchField, UrlField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field/index.js';

function FacebookVideoBlockModal(props) {
  const { nodeRef: containerRef } = props.containerFormContext;
  return (
    <>
      <UrlField name="href" label="Facebook Video URL" />
      <SwitchField name="autoplay" label="Autoplay" />
      <SwitchField name="show_text" label="Show Text" />
      <SwitchField name="show_captions" label="Show Captions" />
      <ImageAssetPickerField name="poster_image_ref" label="Poster Image" nodeRef={containerRef} />
    </>
  );
}

export default withBlockModal(FacebookVideoBlockModal);
