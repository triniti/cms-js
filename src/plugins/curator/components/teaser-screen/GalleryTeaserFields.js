import React from 'react';
import GalleryPickerField from 'plugins/curator/components/gallery-picker-field';

export default function GalleryTeaserFields() {
  return (
    <GalleryPickerField name="target_ref" label="Target Gallery" readOnly />
  );
}
