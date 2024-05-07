import React from 'react';
import CategoryPickerField from '@triniti/cms/plugins/taxonomy/components/category-picker-field/index.js';

export default function CategoryTeaserFields() {
  return (
    <CategoryPickerField name="target_ref" label="Target Category" readOnly />
  );
}
