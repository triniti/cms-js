import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';

function YoutubeVideoBlockPreview(props) {
  const { pbj } = props;

  let url = `https://www.youtube.com/watch?v=${pbj.get('id')}`;
  if (pbj.has('start_at')) {
    url += `&t=${pbj.get('start_at')}`;
  }

  return (
    <p>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {pbj.has('poster_image_ref') && (
          <img src={damUrl(pbj.get('poster_image_ref'), '16by9', 'sm')} width={200} height={200} />
        )}
        {!pbj.has('poster_image_ref') && (
          <>{url}</>
        )}
      </a>
    </p>
  );
}

export default withBlockPreview(YoutubeVideoBlockPreview);
