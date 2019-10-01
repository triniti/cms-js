import React from 'react';
import { FieldArray } from 'redux-form';
import GalleryPickerField from '@triniti/cms/plugins/curator/components/gallery-picker-field';

export default (props) => <FieldArray name="targetRefs" isMulti={false} component={GalleryPickerField} {...props} />;
