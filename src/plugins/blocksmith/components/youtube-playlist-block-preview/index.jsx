import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';

const YoutubePlaylistBlockPreview = ({ block }) => {
  const options = {
    allow: block.get('autoplay')
      ? 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
      : 'accelerometer; encrypted-media; gyroscope; picture-in-picture',
    autoplay: block.get('autoplay'),
    frameBorder: '0',
    height: '315',
    src: block.has('video_id')
      ? `https://www.youtube.com/embed/${block.get('video_id')}`
      : `https://www.youtube.com/embed/videoseries?list=${block.get('playlist_id')}`,
    width: '100%',
  };

  return React.createElement('iframe', options);
};

YoutubePlaylistBlockPreview.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
};

export default YoutubePlaylistBlockPreview;
