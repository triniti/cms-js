import React from 'react';
import ArticlePickerField from 'plugins/news/components/article-picker-field';

export default function ArticleTeaserFields() {
  return (
    <ArticlePickerField name="target_ref" label="Target Article" readOnly />
  );
}
