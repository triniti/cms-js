import React from 'react';
import { TextareaField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

function CodeBlockModal() {
  return <TextareaField name="code" label="Code" required rows={10} />;
}

export default withBlockModal(CodeBlockModal);
