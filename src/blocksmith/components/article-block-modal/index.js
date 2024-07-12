import React from 'react';
import ArticlePickerField from '@triniti/cms/plugins/news/components/article-picker-field/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

function ArticleBlockModal(props) {
  console.log('ArticleBlockModal', props);
  return (
    <>
      <ArticlePickerField name="node_ref" label="Article" required />
    </>
  );
}

export default withBlockModal(ArticleBlockModal);
