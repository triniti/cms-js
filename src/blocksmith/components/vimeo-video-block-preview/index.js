import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function VimeoVideoBlockPreview(props) {
  const { block } = props;
  let url = `https://player.vimeo.com/video/${block.get('id')}?`;
  url += `autoplay=${block.get('auto_play') ? 'true' : 'false'}`;
  url += `&loop=${block.get('loop') ? 'true' : 'false'}`;
  url += `&title=${block.get('show_title') ? 'true' : 'false'}`;
  url += `&byline=${block.get('show_byline') ? 'true' : 'false'}`;
  url += `&portrait=${block.get('show_portrait') ? 'true' : 'false'}`;

  return (
    <p>
      <a href={url} target="_blank" rel="noreferrer noopener">{url}</a>
    </p>
  );
}

export default withBlockPreview(VimeoVideoBlockPreview);
