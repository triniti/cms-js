import React from 'react';
import { UrlField, TextField } from '@triniti/cms/components';

export default function LinkTeaserFields() {
  return (
    <>
      <UrlField name="link_url" label="Link URL" required />
      <UrlField name="partner_url" label="Partner URL" />
      <TextField name="partner_text" label="Partner Text" />
    </>
  );
}
