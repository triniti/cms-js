import React from 'react';
import SelectField from '@triniti/cms/components/select-field';

const options = new Map;

export default function TrinaryField(props) {
  const { unknownLabel = 'UNKNOWN', trueLabel = 'TRUE', falseLabel = 'FALSE', ...rest } = props;
  const key = `o${unknownLabel}${trueLabel}${falseLabel}`;

  if (!options.has(key)) {
    options.set(key, [
      { value: 0, label: unknownLabel },
      { value: 1, label: trueLabel },
      { value: 2, label: falseLabel },
    ]);
  }

  return <SelectField {...rest} isClearable={false} options={options.get(key)} />;
}
