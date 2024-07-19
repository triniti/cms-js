import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function IframeBlockPreview(props) {
  const { block } = props;

  const attribs = { src: block.get('src'), loading: 'lazy' };

  if (block.has('width')) {
    attribs.width = block.get('width');
  }

  if (block.has('height')) {
    attribs.height = block.get('height');
  }

  attribs.scrolling = block.get('scrolling_enabled') ? 'auto' : 'no';

  if (block.has('data')) {
    for (const [key, value] of Object.entries(block.get('data'))) {
      attribs[`data-${key}`] = value;
    }
  }

  return (
    <div className={`text-${block.get('align', 'center')}`}>
      <iframe {...attribs}></iframe>
    </div>
  );
}

export default withBlockPreview(IframeBlockPreview);
