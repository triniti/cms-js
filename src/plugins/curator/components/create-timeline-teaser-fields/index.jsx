import { FieldArray } from 'redux-form';
import React from 'react';
import TimelinePickerField from '@triniti/cms/plugins/curator/components/timeline-picker-field';

export default (props) => (
  <FieldArray
    {...props}
    component={TimelinePickerField}
    isEditMode
    isMulti={false}
    label="Search and select a timeline"
    name="targetRefs"
    placeholder="Type to find timelines..."
  />
);
