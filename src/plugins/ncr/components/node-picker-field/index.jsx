import React from 'react';
import MultiSelectField from 'plugins/ncr/components/node-picker-field/MultiSelectField';
import SingleSelectField from 'plugins/ncr/components/node-picker-field/SingleSelectField';

export default function NodePickerField({ isMulti = false, ...rest }) {
  const Component = isMulti ? MultiSelectField : SingleSelectField;
  return <Component {...rest} />;
}
