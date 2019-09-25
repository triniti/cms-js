import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';

const SpotifyTrackBlockPreview = ({ block }) => (
  <iframe
    allow="encrypted-media"
    frameBorder="0"
    height="80"
    src={`https://open.spotify.com/embed/track/${block.get('track_id')}`}
    title="spotify-track-block-preview"
    width="300"
  />
);

SpotifyTrackBlockPreview.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
};

export default SpotifyTrackBlockPreview;
