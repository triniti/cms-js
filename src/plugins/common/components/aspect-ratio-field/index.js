import React from 'react';
import AspectRatio from '@triniti/schemas/triniti/common/enums/AspectRatio.js';
import { EnumField } from '@triniti/cms/components/index.js';

const filter = option => option.value !== 'unknown';
const format = (label) => {
  let newLabel = label;
  if (label.startsWith('R')) {
    newLabel = newLabel.replace('R', '');
  }
  return newLabel.replace('BY', ' x ');
};

export default function AspectRatioField(props) {
  const { name = 'aspect_ratio', label = 'Aspect Ratio', ...rest } = props;
  return (
    <EnumField
      {...rest}
      name={name}
      label={label}
      enumClass={AspectRatio}
      filter={filter}
      format={format}
    />
  );
}
