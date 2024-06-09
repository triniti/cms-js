import React from 'react';
import GalleryPickerField from '@triniti/cms/plugins/curator/components/gallery-picker-field/index.js';

export default function GalleryTeaserFields() {
  return (
    <GalleryPickerField name="target_ref" label="Target Gallery" readOnly />
  );
}
