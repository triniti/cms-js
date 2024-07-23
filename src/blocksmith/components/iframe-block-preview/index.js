import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function IframeBlockPreview(props) {
  const { block } = props;

  const attribs = {
    src: block.get('src'),
    width: block.get('width', '100%'),
    height: block.get('height', '100%'),
    scrolling: block.get('scrolling_enabled') ? 'auto' : 'no',
    loading: 'lazy',
  };

  // Calculate ratio styles if both width and height are in pixels
  const ratioStyle = {};
  let ratioClass = '';

  if (attribs.width.includes('px') && attribs.height.includes('px')) {
    try {
      ratioStyle.paddingTop = `${(parseInt(attribs.height, 10) / parseInt(attribs.width, 10) * 100)}%`;
      ratioClass = 'ratio';
    } catch (e) {
      console.error('IframeBlockPreview.ratioError', e, block.toObject());
    }
  }

  if (block.has('data')) {
    for (const [key, value] of Object.entries(block.get('data'))) {
      attribs[`data-${key}`] = value;
    }
  }

  return (
    <div className={`ratio-${block.get('align', 'center')}`} style={{ maxWidth: attribs.width }}>
      <div className={ratioClass} style={ratioStyle}>
        <iframe {...attribs}></iframe>
      </div>
    </div>
  );
}

export default withBlockPreview(IframeBlockPreview);
