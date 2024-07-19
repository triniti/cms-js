import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function TiktokEmbedBlockPreview(props) {
  const { block } = props;
  const url = `https://www.tiktok.com/embed/v2/${block.get('tiktok_id')}`;

  return (
    <p>
      <a href={url} target="_blank" rel="noreferrer noopener">{url}</a>
    </p>
  );
}

export default withBlockPreview(TiktokEmbedBlockPreview);
