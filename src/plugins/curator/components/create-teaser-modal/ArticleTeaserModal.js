import React from 'react';
import ArticlePickerField from '@triniti/cms/plugins/news/components/article-picker-field/index.js';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal.js';

function ArticleTeaserModal() {
  return (
    <>
      <ArticlePickerField name="target_ref" label="Target Article" required />
    </>
  );
}

export default withTeaserModal(ArticleTeaserModal);
