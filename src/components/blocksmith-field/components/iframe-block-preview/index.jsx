import React from 'react';

export default function IframeBlockPreview({ block }) {
  const divStyle = {};
  const iframeStyle = {};
  if (!block.has('height') && !block.has('width')) {
    divStyle.position = 'relative';
    divStyle.paddingTop = '56.25%';
    iframeStyle.position = 'absolute';
    iframeStyle.top = 0;
    iframeStyle.bottom = 0;
    iframeStyle.width = '100%';
    iframeStyle.height = '100%';
  } else {
    iframeStyle.width = block.get('width');
    iframeStyle.height = block.get('height');
  }

  return (
    <div style={divStyle}>
      <iframe
        align={block.get('align') || 'center'}
        allowFullScreen
        frameBorder="0"
        src={block.get('src')}
        title="iframe-block-preview"
        style={iframeStyle}
      />
    </div>
  );
};
