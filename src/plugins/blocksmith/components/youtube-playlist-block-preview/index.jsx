import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';

const YoutubePlaylistBlockPreview = ({ block }) => {
  const options = {
    title: 'Youtube Playlist Block',
    width: '100%',
    height: '315',
    src: `https://www.youtube.com/embed/videoseries?list=${block.get('playlist_id')}`,
    frameBorder: '0',
    allow: block.get('autoplay')
      ? 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
      : 'accelerometer; encrypted-media; gyroscope; picture-in-picture',
  };

  return React.createElement('iframe', options);
};

YoutubePlaylistBlockPreview.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
};

export default YoutubePlaylistBlockPreview;
