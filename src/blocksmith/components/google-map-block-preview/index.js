import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

// todo: this url construction is wonky, need to get zoom, maptype, center to work.
function GoogleMapBlockPreview(props) {
  const { block } = props;

  let url = 'https://www.google.com/maps?q=';
  if (block.has('q')) {
    url += `${encodeURI(block.get('q'))}`;
  }

  if (block.get('zoom') > 0) {
    url += `&z=${block.get('zoom')}`;
  }

  return (
    <p>
      <a href={url} target="_blank" rel="noreferrer noopener">{block.get('q', url)}</a>
    </p>
  );
}

export default withBlockPreview(GoogleMapBlockPreview);
