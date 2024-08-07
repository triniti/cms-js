import React from 'react';
import { TextField, UrlField } from '@triniti/cms/components/index.js';
import AspectRatioField from '@triniti/cms/plugins/common/components/aspect-ratio-field/index.js';
import DocumentAssetPickerField from '@triniti/cms/plugins/dam/components/document-asset-picker-field/index.js';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';
import AsideField from '@triniti/cms/blocksmith/components/with-block-modal/AsideField.js';

function DocumentBlockModal(props) {
  const { nodeRef: containerRef } = props.containerFormContext;
  return (
    <>
      <DocumentAssetPickerField name="node_ref" label="Document" required nodeRef={containerRef} />
      <ImageAssetPickerField name="image_ref" label="Poster Image" nodeRef={containerRef} />
      <AspectRatioField />
      <TextField name="title" label="Custom Title" description="When not set, the document's title will be used." />
      <TextField name="launch_text" label="Launch Text" />
      <UrlField
        name="fallback_src_url"
        label="Fallback Source URL"
        description="For imported document blocks that are hosted externally."
      />
      <AsideField />
    </>
  );
}

export default withBlockModal(DocumentBlockModal);
