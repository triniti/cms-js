/**
 * Article Picker Field for Article Block Modal
 */
import React from 'react';
import ArticlePickerField from '@triniti/cms/plugins/news/components/article-picker-field/index.js';
import NodeStatus from "@gdbots/schemas/gdbots/ncr/enums/NodeStatus.js";

const ArticleBlockArticlePickerField = (props) => {
    const defaultStatuses = [NodeStatus.SCHEDULED, NodeStatus.PUBLISHED];

    return (
        <ArticlePickerField
            {...props}
            statuses={props.statuses || defaultStatuses}
        />
    );
};

export default ArticleBlockArticlePickerField;