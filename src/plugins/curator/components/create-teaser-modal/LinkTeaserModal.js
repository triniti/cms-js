import React from 'react';
import { TextField, UrlField } from '@triniti/cms/components/index.js';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal.js';

function LinkTeaserModal() {
  return (
    <>
      <TextField name="title" label="Title" required />
      <UrlField name="link_url" label="Link URL" required />
    </>
  );
}

export default withTeaserModal(LinkTeaserModal);
