import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function DividerBlockPreview(props) {
  const { block } = props;
  const color = block.get('stroke_color', 'primary');
  const style = block.get('stroke_style', 'solid');
  return (
    <div className={`divider-block divider-block-${color}`} style={{ borderTopStyle: style }}>
      <h5>{block.get('text')}</h5>
    </div>
  );
}

export default withBlockPreview(DividerBlockPreview);
