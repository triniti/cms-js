import React from 'react';
import MultiSelectField from 'components/select-field/MultiSelectField';
import SingleSelectField from 'components/select-field/SingleSelectField';

export default function SelectField({ isMulti = false, ...rest }) {
  const Component = isMulti ? MultiSelectField : SingleSelectField;
  return <Component {...rest} />;
}
