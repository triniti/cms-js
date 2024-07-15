import React from 'react';
import { SwitchField, TextField, UrlField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

function PinterestPinBlockModal() {
  return (
    <>
      <UrlField name="href" label="Pinterest Pin URL" required />
      <SwitchField name="terse" label="Hide Description" />
      <TextField name="size" label="Size" />
    </>
  );
}

export default withBlockModal(PinterestPinBlockModal);
