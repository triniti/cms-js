import React from 'react';
import { components } from 'react-select';

export default function Option(props) {
  const { data } = props;

  return (
    <components.Option {...props}>
      <span className={`select__status status-${data.value}`}>{data.label}</span>
    </components.Option>
  );
}
