/**
 * Article Picker Field for Article Block Modal
 */
import React from 'react';
import ArticlePickerField from '@triniti/cms/plugins/news/components/article-picker-field/index.js';

const ArticleBlockArticlePickerField = (props) => {
    return (
        <ArticlePickerField
            {...props}
            statuses={props.statuses}
        />
    );
};

export default ArticleBlockArticlePickerField;