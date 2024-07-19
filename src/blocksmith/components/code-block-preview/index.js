import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function CodeBlockPreview(props) {
  const { block } = props;
  return (
    <textarea className="form-control" rows={4} readOnly value={block.get('code')} />
  );
}

export default withBlockPreview(CodeBlockPreview);
