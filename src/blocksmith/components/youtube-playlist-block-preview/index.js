import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';

function YoutubePlaylistBlockPreview(props) {
  const { block } = props;
  let url = `https://www.youtube.com/watch?list=${block.get('playlist_id')}`;
  if (block.has('video_id')) {
    url += `&v=${block.get('video_id')}`;
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

export default withBlockPreview(YoutubePlaylistBlockPreview);
