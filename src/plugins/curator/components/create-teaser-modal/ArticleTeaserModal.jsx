import React from 'react';
import { ModalBody } from 'reactstrap';
import ArticlePickerField from 'plugins/news/components/article-picker-field';
import withTeaserModal from 'plugins/curator/components/create-teaser-modal/withTeaserModal';

function ArticleTeaserModal() {
  return (
    <ModalBody>
      <ArticlePickerField name="target_ref" label="Target Article" required />
    </ModalBody>
  );
}

export default withTeaserModal(ArticleTeaserModal);
