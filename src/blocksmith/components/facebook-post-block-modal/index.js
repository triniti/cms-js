import React from 'react';
import { SwitchField, UrlField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

function FacebookPostBlockModal() {
  return (
    <>
      <UrlField name="href" label="Facebook Post URL" />
      <SwitchField name="show_text" label="Show Text" />
    </>
  );
}

export default withBlockModal(FacebookPostBlockModal);
