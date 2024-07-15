import React from 'react';
import { SwitchField, TextField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

function InstagramMediaBlockModal() {
  return (
    <>
      <TextField name="id" label="Instagram Media ID" required />
      <SwitchField name="hidecaption" label="Hide Caption" />
    </>
  );
}

export default withBlockModal(InstagramMediaBlockModal);
