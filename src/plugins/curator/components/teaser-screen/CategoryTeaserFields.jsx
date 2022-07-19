import React from 'react';
import CategoryPickerField from 'plugins/taxonomy/components/category-picker-field';

export default function CategoryTeaserFields() {
  return (
    <CategoryPickerField name="target_ref" label="Target Category" readOnly />
  );
}
