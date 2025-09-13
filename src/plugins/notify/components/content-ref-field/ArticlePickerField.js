/**
 * Article Picker Field for Content Ref Field (Notifications)
 */
import React from 'react';
import ArticlePickerField from '@triniti/cms/plugins/news/components/article-picker-field/index.js';

const ContentRefArticlePickerField = (props) => {
  return (
    <ArticlePickerField 
      {...props} 
      statuses={props.statuses}
    />
  );
};

export default ContentRefArticlePickerField;