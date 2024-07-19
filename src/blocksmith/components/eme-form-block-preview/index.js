import React from 'react';
import { expand } from '@gdbots/pbjx/pbjUrl.js';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function EmeFormBlockPreview(props) {
  const { block } = props;
  const formRef = block.get('form_ref');
  const url = expand('eme-form-block.canonical', { id: formRef.getId() });

  return (
    <p>
      <a href={url} target="_blank" rel="noreferrer noopener">{url}</a>
    </p>
  );
}

export default withBlockPreview(EmeFormBlockPreview);
