import React from 'react';
import { components } from 'react-select';

export default function SingleValue(props) {
  const { data } = props;

  return (
    <components.SingleValue className={`select__value status-${data.value}`} {...props}>
      <span className="select__value-label">{data.label}</span>
    </components.SingleValue>
  );
}
