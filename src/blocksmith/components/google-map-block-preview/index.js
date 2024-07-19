import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function GoogleMapBlockPreview(props) {
  const { block } = props;

  let url = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&maptype=${block.get('maptype', 'roadmap')}`;
  if (block.has('q')) {
    url += `&q=${encodeURI(block.get('q'))}`;
  }

  if (block.get('zoom') > 0) {
    url += `&zoom=${block.get('zoom')}`;
  }

  return (
    <div className="embed-responsive text-center">
      <iframe src={url} width={560} height={315} loading="lazy"></iframe>
    </div>
  );
}

export default withBlockPreview(GoogleMapBlockPreview);
