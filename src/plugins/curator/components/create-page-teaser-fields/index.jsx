import React from 'react';
import { FieldArray } from 'redux-form';
import PagePickerField from '@triniti/cms/plugins/canvas/components/page-picker-field';

export default (props) => <FieldArray name="targetRefs" isMulti={false} component={PagePickerField} {...props} />;
