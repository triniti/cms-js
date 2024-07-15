import React from 'react';
import { SwitchField, TextField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

function ImgurPostBlockModal() {
  return (
    <>
      <TextField name="id" label="Imgur Post ID" required />
      <SwitchField name="show_context" label="Show Context" />
    </>
  );
}

export default withBlockModal(ImgurPostBlockModal);
