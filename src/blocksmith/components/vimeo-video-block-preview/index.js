import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function VimeoVideoBlockPreview(props) {
  const { block } = props;
  let url = `https://player.vimeo.com/video/${block.get('id')}?`;
  // url += `autoplay=${block.get('auto_play') ? '1' : '0'}`; // never autoplay within blocksmith
  url += `&loop=${block.get('loop') ? '1' : '0'}`;
  url += `&title=${block.get('show_title') ? '1' : '0'}`;
  url += `&byline=${block.get('show_byline') ? '1' : '0'}`;
  url += `&portrait=${block.get('show_portrait') ? '1' : '0'}`;

  return (
    <div className="ratio ratio-16x9 ms-auto me-auto" style={{ maxWidth: '640px' }}>
      <iframe src={url} width={640} height={439} loading="lazy"></iframe>
    </div>
  );
}

export default withBlockPreview(VimeoVideoBlockPreview);
