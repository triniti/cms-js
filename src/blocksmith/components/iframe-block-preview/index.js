import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function IframeBlockPreview(props) {
  const { block } = props;
  return (
    <p>
      <a href={block.get('src')} target="_blank" rel="noreferrer noopener">{block.get('src')}</a>
    </p>
  );
}

export default withBlockPreview(IframeBlockPreview);
