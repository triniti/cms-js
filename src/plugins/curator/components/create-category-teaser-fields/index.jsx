import React from 'react';
import { FieldArray } from 'redux-form';
import CategoryPickerField from '@triniti/cms/plugins/taxonomy/components/category-picker-field';

export default (props) => <FieldArray name="targetRefs" isEditMode isMulti={false} component={CategoryPickerField} {...props} />;
