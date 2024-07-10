import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { NumberField } from '@triniti/cms/components/index.js';
import GalleryPickerField from '@triniti/cms/plugins/curator/components/gallery-picker-field/index.js';

export default function GalleryCard(props) {
  const { node } = props;
  if (!node.has('gallery_ref')) {
    return null;
  }

  return (
    <Card>
      <CardHeader>Gallery</CardHeader>
      <CardBody>
        <GalleryPickerField name="gallery_ref" label="Gallery" readOnly />
        <NumberField name="gallery_seq" label="Gallery Sequence" />
      </CardBody>
    </Card>
  );
}
