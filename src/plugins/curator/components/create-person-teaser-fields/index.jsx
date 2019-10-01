import React from 'react';
import { FieldArray } from 'redux-form';
import PeoplePickerField from '@triniti/cms/plugins/people/components/people-picker-field';

export default (props) => <FieldArray name="targetRefs" isMulti={false} isEditMode component={PeoplePickerField} {...props} />;
