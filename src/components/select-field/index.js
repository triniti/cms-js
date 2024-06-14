import React from 'react';
import MultiSelectField from '@triniti/cms/components/select-field/MultiSelectField.js';
import SingleSelectField from '@triniti/cms/components/select-field/SingleSelectField.js';

export default function SelectField({ isMulti = false, ...rest }) {
  const Component = isMulti ? MultiSelectField : SingleSelectField;
  return <Component {...rest} />;
}

