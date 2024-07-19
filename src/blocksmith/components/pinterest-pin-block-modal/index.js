import React from 'react';
import { SelectField, SwitchField, UrlField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

const sizes = [
  { label: 'small', value: 'small' },
  { label: 'medium', value: 'medium' },
  { label: 'large', value: 'large' },
];

function PinterestPinBlockModal() {
  return (
    <>
      <UrlField name="href" label="Pinterest Pin URL" required />
      <SwitchField name="terse" label="Hide Description" />
      <SelectField name="size" label="Size" options={sizes} />
    </>
  );
}

export default withBlockModal(PinterestPinBlockModal);
