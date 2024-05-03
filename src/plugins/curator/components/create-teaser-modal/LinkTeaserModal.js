import React from 'react';
import { ModalBody } from 'reactstrap';
import { TextField, UrlField } from '@triniti/cms/components/index.js';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal';

function LinkTeaserModal() {
  return (
    <ModalBody>
      <TextField name="title" label="Title" required />
      <UrlField name="link_url" label="Link URL" required />
    </ModalBody>
  );
}

export default withTeaserModal(LinkTeaserModal);
