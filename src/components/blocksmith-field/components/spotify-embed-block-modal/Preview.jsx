import React from 'react';

export default function Preview (props) {
  const { formState } = props;
  const { valid } = formState;
  const { spotify_id: spotifyId, spotify_type: spotifyType } = formState.values;

  const defaultEmbed = (
    <iframe
      src={`https://open.spotify.com/embed/${spotifyType}/${spotifyId}/`}
      width="300"
      height="380"
      frameBorder="0"
      allow="encrypted-media"
      title="Spotify Embed Block"
    />
  );

  const podcastEmbed = (
    <iframe
      src={`https://open.spotify.com/embed-podcast/${spotifyType}/${spotifyId}/`}
      width="100%"
      height="232"
      frameBorder="0"
      allow="encrypted-media"
      title="Spotify Embed Block"
    />
  );

  switch (spotifyType) {
    case 'show':
    case 'episode':
      return podcastEmbed;

    case 'artist':
    case 'album':
    case 'track':
    case 'playlist':
      return defaultEmbed;

    default:
      return '';
  }
};