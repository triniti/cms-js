// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';

const SpotifyEmbedBlockPreview = ({ block }) => {
  const spotifyId = block.get('spotify_id');
  const spotifyType = block.get('spotify_type');

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

    case 'album':
    case 'track':
    case 'playlist':
      return defaultEmbed;

    default:
      return '';
  }
};

SpotifyEmbedBlockPreview.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
};

export default SpotifyEmbedBlockPreview;
