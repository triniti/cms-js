import React from 'react';
import { SwitchField, TextareaField, TextField, UrlField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

function QuoteBlockModal() {
  return (
    <>
      <TextareaField name="text" label="Text" />
      <TextField name="source" label="Source" />
      <UrlField name="source_url" label="Source URL" />
      <SwitchField name="is_pull_quote" label="Is Pull Quote" />
    </>
  );
}

export default withBlockModal(QuoteBlockModal);
