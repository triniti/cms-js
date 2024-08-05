import React from 'react';
import AspectRatio from '@triniti/schemas/triniti/common/enums/AspectRatio.js';
import { EnumField } from '@triniti/cms/components/index.js';

const labels = {
  'R16BY9': 'Widescreen - 16:9',
  'R5BY4': 'Horizontal - 5:4',
  'R4BY3': 'Horizontal - 4:3',
  'R3BY2': 'Horizontal - 3:2',
  'R1BY1': 'Square - 1:1',
  'R2BY3': 'Vertical - 2:3',
  'R3BY4': 'Vertical - 3:4',
  'R4BY5': 'Vertical - 4:5',
  'R5BY6': 'Gallery - 5:6',
  'R6BY5': 'Gallery - 6:5',
  'R9BY16': 'Long Vertical - 9:16',
};

const filter = option => option.value !== 'unknown';
const format = label => labels[label] || label;

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
