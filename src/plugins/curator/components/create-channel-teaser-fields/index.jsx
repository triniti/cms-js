import React from 'react';
import { FieldArray } from 'redux-form';
import ChannelPickerField from '@triniti/cms/plugins/taxonomy/components/channel-picker-field';

export default (props) => <FieldArray name="targetRefs" isEditMode multi={false} component={ChannelPickerField} {...props} />;
