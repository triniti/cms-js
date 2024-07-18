import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';

function YoutubeVideoBlockPreview(props) {
  const { block } = props;
  let url = `https://www.youtube.com/watch?v=${block.get('id')}`;
  if (block.get('start_at') > 0) {
    url += `&t=${block.get('start_at')}`;
  }

  return (
    <p>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {block.has('poster_image_ref') && (
          <img src={damUrl(block.get('poster_image_ref'), '16by9', 'sm')} width={200} height={200} />
        )}
        {!block.has('poster_image_ref') && (
          <>{url}</>
        )}
      </a>
    </p>
  );
}

export default withBlockPreview(YoutubeVideoBlockPreview);
