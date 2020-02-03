import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';

const SoundcloudAudioBlockPreview = ({ block, width }) => {
  const autoplay = typeof block.get('auto_play') === 'boolean' ? block.get('auto_play') : true;
  const hideRelated = typeof block.get('hide_related') === 'boolean' ? block.get('hide_related') : true;
  const showComments = typeof block.get('show_comments') === 'boolean' ? block.get('show_comments') : true;
  const visual = typeof block.get('visual') === 'boolean' ? block.get('visual') : true;
  return (
    <iframe
      frameBorder="0"
      title="soundcloud-audio-block-preview"
      width={width}
      height={width / (16 / 9)}
      src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${block.get('track_id') || ''}&auto_play=${autoplay}&hide_related=${hideRelated}&show_comments=${showComments}&visual=${visual}`}
      allowFullScreen
    />
  );
};



SoundcloudAudioBlockPreview.propTypes = {
  block: PropTypes.instanceOf(Message).isRequired,
  width: PropTypes.number.isRequired,
};

export default SoundcloudAudioBlockPreview;
