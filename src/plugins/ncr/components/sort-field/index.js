import React from 'react';
import { EnumField } from '@triniti/cms/components/index.js';

const filter = option => option.value !== 'unknown';

export default function SortField(props) {
  return <EnumField filter={filter} name="sort" label="Sort" {...props} />;
}
