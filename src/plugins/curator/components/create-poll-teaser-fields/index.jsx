import { FieldArray } from 'redux-form';
import PollPickerField from '@triniti/cms/plugins/apollo/components/poll-picker-field';
import React from 'react';

export default (props) => <FieldArray name="targetRefs" isMulti={false} component={PollPickerField} {...props} />;
