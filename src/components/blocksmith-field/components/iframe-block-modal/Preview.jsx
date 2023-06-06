import React from 'react';

export default function Preview(props) {
  const { formState } = props;
  const { height, width, align, src } = formState.values;
  const divStyle = {};
  const iframeStyle = {};
  if (!height && !width) {
    divStyle.position = 'relative';
    divStyle.paddingTop = '56.25%';
    iframeStyle.position = 'absolute';
    iframeStyle.top = 0;
    iframeStyle.bottom = 0;
    iframeStyle.width = '100%';
    iframeStyle.height = '100%';
  } else {
    iframeStyle.width = width;
    iframeStyle.height = height;
  }

  return (
    <div style={divStyle} className="mb-4">
      <iframe
        align={align || 'center'}
        allowFullScreen
        frameBorder="0"
        src={src}
        title="iframe-block-preview"
        style={iframeStyle}
      />
    </div>
  );
};
