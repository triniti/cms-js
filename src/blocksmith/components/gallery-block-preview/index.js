import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function GalleryBlockPreview(props) {
  const { pbj } = props;
  return (
    <p>{JSON.stringify(pbj)}</p>
  );
}

export default withBlockPreview(GalleryBlockPreview);