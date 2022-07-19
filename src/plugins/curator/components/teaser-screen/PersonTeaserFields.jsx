import React from 'react';
import PersonPickerField from 'plugins/people/components/person-picker-field';

export default function PersonTeaserFields() {
  return (
    <PersonPickerField name="target_ref" label="Target Person" readOnly />
  );
}
