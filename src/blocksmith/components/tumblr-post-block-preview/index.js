import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function TumblrPostBlockPreview(props) {
  const { block } = props;
  const url = block.get('canonical_url', block.get('url'));

  return (
    <p>
      <a href={url} target="_blank" rel="noreferrer noopener">{url}</a>
    </p>
  );
}

export default withBlockPreview(TumblrPostBlockPreview);
