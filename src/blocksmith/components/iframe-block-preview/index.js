import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function IframeBlockPreview(props) {
  const { block } = props;

  const attribs = { src: block.get('src'), loading: 'lazy' };

  // Set width if provided
  if (block.has('width')) {
    attribs.width = block.get('width');
  } else {
    attribs.width = '100%';
  }

  // Set height if provided
  if (block.has('height')) {
    attribs.height = block.get('height');
  } else {
    attribs.height = '100%';
  }

  // Calculate ratio styles if both width and height are in pixels
  let myRatio = {};
  let myClass = '';

  if (attribs.width.includes("px") && attribs.height.includes("px")) {
    const ratioPaddingTop = `${(parseInt(attribs.height, 10) / parseInt(attribs.width, 10) * 100)}%`;
    myRatio = { paddingTop: ratioPaddingTop };
    myClass = 'ratio';
  }

  // Determine alignment class
  const alignClass = `ratio-${block.get('align', 'center')}`;

  // Apply max-width style
  const myMaxWidth = {
    maxWidth: attribs.width
  };

  attribs.scrolling = block.get('scrolling_enabled') ? 'auto' : 'no';

  if (block.has('data')) {
    for (const [key, value] of Object.entries(block.get('data'))) {
      attribs[`data-${key}`] = value;
    }
  }

  return (
    <div className={alignClass} style={myMaxWidth}>
      <div className={myClass} style={myRatio} >
        <iframe {...attribs}></iframe>
      </div>
    </div>
  );
}

export default withBlockPreview(IframeBlockPreview);
