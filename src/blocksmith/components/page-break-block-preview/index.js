import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function PageBreakBlockPreview(props) {
  const { block } = props;

  if (!block.has('read_more_text')) {
    return null;
  }

  return (
    <p>{block.get('read_more_text')}</p>
  );
}

export default withBlockPreview(PageBreakBlockPreview);
