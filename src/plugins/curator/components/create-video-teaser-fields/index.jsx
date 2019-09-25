import { FieldArray } from 'redux-form';
import React from 'react';
import VideoPickerField from '@triniti/cms/plugins/ovp/components/video-picker-field';

export default (props) => <FieldArray name="targetRefs" isMulti={false} component={VideoPickerField} {...props} />;
