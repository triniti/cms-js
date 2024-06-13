import React from 'react';

export default function SpotifyTrackBlockPreview(props) {
  const { formState } = props;
  const { track_id: trackId } = formState.values;

  return (
    <iframe
      allow="encrypted-media"
      frameBorder="0"
      height="80"
      src={`https://open.spotify.com/embed/track/${trackId}`}
      title="spotify-track-block-preview"
      width="300"
    />
  );
}