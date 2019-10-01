import React from 'react';
import { FieldArray } from 'redux-form';
import ArticlePicker from '@triniti/cms/plugins/news/components/article-picker-field';

export default (props) => <FieldArray name="targetRefs" isMulti={false} component={ArticlePicker} {...props} />;
