import React from 'react';
import AspectRatio from '@triniti/schemas/triniti/common/enums/AspectRatio.js';
import { EnumField, SwitchField, TextareaField, TextField, UrlField } from '@triniti/cms/components/index.js';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';
import AsideField from '@triniti/cms/blocksmith/components/with-block-modal/AsideField.js';

function ImageBlockModal(props) {
  const { nodeRef: containerRef } = props.containerFormContext;
  return (
    <>
      <ImageAssetPickerField name="node_ref" label="Image" required nodeRef={containerRef} />
      <EnumField enumClass={AspectRatio} name="aspect_ratio" label="Aspect Ratio" />
      <TextField name="title" label="Custom Title" description="When not set, the image's title will be used." />
      <TextareaField name="caption" label="Caption" rows={2} />
      <TextField name="launch_text" label="Launch Text" />
      <UrlField name="url" label="URL" />
      <SwitchField name="is_nsfw" label="NSFW" />
      <UrlField
        name="fallback_src_url"
        label="Fallback Source URL"
        description="For imported image blocks that are hosted externally."
      />
      <AsideField />
    </>
  );
}

export default withBlockModal(ImageBlockModal);
