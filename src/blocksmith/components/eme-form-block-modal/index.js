import React from 'react';
import { DatePickerField, TextField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

function EmeFormBlockModal() {
  return (
    <>
      <TextField name="form_ref" label="EME Form Ref" required placeholder="eme:form:id" />
      <DatePickerField name="expires_at" label="Expires At" />
    </>
  );
}

export default withBlockModal(EmeFormBlockModal);
