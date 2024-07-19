import React from 'react';
import { Alert } from 'reactstrap';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function SpotifyTrackBlockPreview(props) {
  const { block } = props;
  const url = `https://open.spotify.com/track/${block.get('track_id')}`;

  return (
    <>
      <Alert color="warning">This block is deprecated, use the Spotify Embed block instead.</Alert>
      <p>
        <a href={url} target="_blank" rel="noreferrer noopener">{url}</a>
      </p>
    </>
  );
}

export default withBlockPreview(SpotifyTrackBlockPreview);
