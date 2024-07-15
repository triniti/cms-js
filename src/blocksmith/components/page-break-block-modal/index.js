import React from 'react';
import { TextField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

function PageBreakBlockModal() {
  return (
    <>
      <TextField name="read_more_text" label="Read More Text" />
    </>
  );
}

export default withBlockModal(PageBreakBlockModal);
