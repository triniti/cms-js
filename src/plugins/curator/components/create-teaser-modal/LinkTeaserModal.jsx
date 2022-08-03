import React from 'react';
import { ModalBody } from 'reactstrap';
import { TextField, UrlField } from 'components';
import withTeaserModal from 'plugins/curator/components/create-teaser-modal/withTeaserModal';

function LinkTeaserModal() {
  return (
    <ModalBody>
      <TextField name="title" label="Title" required />
      <UrlField name="link_url" label="Link URL" required />
    </ModalBody>
  );
}

export default withTeaserModal(LinkTeaserModal);
