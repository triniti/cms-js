import React from 'react';
import { ModalBody } from 'reactstrap';
import ArticlePickerField from '@triniti/cms/plugins/news/components/article-picker-field/index.js';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal.js';

function ArticleTeaserModal() {
  return (
    <ModalBody>
      <ArticlePickerField name="target_ref" label="Target Article" required />
    </ModalBody>
  );
}

export default withTeaserModal(ArticleTeaserModal);
