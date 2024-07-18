import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function DividerBlockPreview(props) {
  const { block } = props;
  const color = block.get('stroke_color', 'primary');
  const style = block.get('stroke_style', 'solid');
  return (
    <div className={`block-stroke-${color}-${style}`}>
      <span className="block-text">{block.get('text')}</span>
      <hr />
    </div>
  );
}

export default withBlockPreview(DividerBlockPreview);
