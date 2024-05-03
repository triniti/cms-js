import React from 'react';
import { EnumField } from '@triniti/cms/components/index.js';
import startCase from 'lodash-es/startCase';

const filter = option => option.value !== 'unknown';
const format = label => startCase(label.toLowerCase()).replace(/(Asc|Desc)/, '$1ending');

export default function SortField(props) {
  return <EnumField filter={filter} name="sort" label="Sort" format={format} {...props} />;
}
