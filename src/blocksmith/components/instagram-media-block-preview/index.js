import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function InstagramMediaBlockPreview(props) {
  const { block } = props;
  const url = `https://www.instagram.com/p/${block.get('id')}/`;
  return (
    <p>
      <a href={url} target="_blank" rel="noreferrer noopener">{url}</a>
    </p>
  );
}

export default withBlockPreview(InstagramMediaBlockPreview);
