import React from 'react';
import { Media } from 'reactstrap';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function YoutubeVideoBlockPreview(props) {
  const { block } = props;

  if (block.has('poster_image_ref')) {
    let url = `https://www.youtube.com/watch?v=${block.get('id')}`;
    if (block.get('start_at') > 0) {
      url += `&t=${block.get('start_at')}`;
    }

    return (
      <p>
        <a href={url} className="hover-box-shadow d-inline-block rounded-2" target="_blank" rel="noreferrer noopener">
          <Media
            src={damUrl(block.get('poster_image_ref'), '16by9', 'sm')}
            className="rounded-2 ratio-16x9"
            alt=""
            width="100%"
            height="auto"
            object
          />
        </a>
      </p>
    );
  }

  let url = `https://www.youtube-nocookie.com/embed/${block.get('id')}`;
  if (block.get('start_at') > 0) {
    url += `?start=${block.get('start_at')}`;
  }

  return (
    <div className="embed-responsive embed-responsive-16by9 text-center">
      <iframe width="560" height="315" src={url}></iframe>
    </div>
  );
}

export default withBlockPreview(YoutubeVideoBlockPreview);
