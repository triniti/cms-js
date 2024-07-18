import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function SoundcloudAudioBlockPreview(props) {
  const { block } = props;
  let url = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${block.get('track_id')}`;
  url += `&auto_play=${block.get('auto_play') ? 'true' : 'false'}`;
  url += `&hide_related=${block.get('hide_related') ? 'true' : 'false'}`;
  url += `&show_comments=${block.get('show_comments') ? 'true' : 'false'}`;
  url += `&visual=${block.get('visual') ? 'true' : 'false'}`;

  return (
    <p>
      <a href={url} target="_blank" rel="noreferrer noopener">{url}</a>
    </p>
  );
}

export default withBlockPreview(SoundcloudAudioBlockPreview);
