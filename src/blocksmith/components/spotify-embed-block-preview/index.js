import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function SpotifyEmbedBlockPreview(props) {
  const { block } = props;
  const url = `https://open.spotify.com/embed/${block.get('spotify_type')}/${block.get('spotify_id')}?theme=0`;

  return (
    <div className="embed-responsive text-center">
      <iframe src={url} width="100%" height={152} loading="lazy"></iframe>
    </div>
  );
}

export default withBlockPreview(SpotifyEmbedBlockPreview);
