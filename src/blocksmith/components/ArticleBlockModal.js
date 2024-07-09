import React from 'react';
import ArticlePickerField from '@triniti/cms/plugins/news/components/article-picker-field/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/withBlockModal.js';

function ArticleBlockModal() {
  return (
    <>
      <ArticlePickerField name="node_ref" label="Article" required />
    </>
  );
}

export default withBlockModal(ArticleBlockModal);
