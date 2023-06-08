import React from 'react';

export default function Preview(props) {
  const { formState, width = 510 } = props;
  const { auto_play: autoPlay = true, hide_related: hideRelated = true, show_comments: showComments = true, track_id: trackId, visual = true } = formState.values;
  
  return (
    <iframe
      frameBorder="0"
      title="soundcloud-audio-block-preview"
      width={width}
      height={width / (16 / 9)}
      src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackId || ''}&auto_play=${autoPlay}&hide_related=${hideRelated}&show_comments=${showComments}&visual=${visual}`}
      allowFullScreen
    />
  );
};