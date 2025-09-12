/**
 * Article Picker Field for Content Ref Field (Notifications)
 */
import React from 'react';
import ArticlePickerField from '@triniti/cms/plugins/news/components/article-picker-field/index.js';
import NodeStatus from "@gdbots/schemas/gdbots/ncr/enums/NodeStatus.js";

const ContentRefArticlePickerField = (props) => {
  const defaultStatuses = [NodeStatus.PUBLISHED, NodeStatus.DRAFT];
  
  return (
    <ArticlePickerField 
      {...props} 
      statuses={props.statuses || defaultStatuses}
    />
  );
};

export default ContentRefArticlePickerField;