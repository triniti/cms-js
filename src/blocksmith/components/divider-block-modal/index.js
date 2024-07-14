import React from 'react';
import { SelectField, TextField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

const colors = [
  { label: 'primary', value: 'primary' },
  { label: 'secondary', value: 'secondary' },
];

const styles = [
  { label: 'solid', value: 'solid' },
  { label: 'dotted', value: 'dotted' },
  { label: 'dashed', value: 'dashed' },
];

function DividerBlockModal() {
  return (
    <>
      <TextField name="text" label="Text" />
      <SelectField name="stroke_color" label="Color" options={colors} />
      <SelectField name="stroke_style" label="Style" options={styles} />
    </>
  );
}

export default withBlockModal(DividerBlockModal);
