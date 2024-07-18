import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function SpotifyEmbedBlockPreview(props) {
  const { block } = props;
  const url = `https://open.spotify.com/${block.get('spotify_type')}/${block.get('spotify_id')}`;

  return (
    <p>
      <a href={url} target="_blank" rel="noreferrer noopener">{url}</a>
    </p>
  );
}

export default withBlockPreview(SpotifyEmbedBlockPreview);
