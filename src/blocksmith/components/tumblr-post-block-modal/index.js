import React from 'react';
import { UrlField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

function TumblrPostBlockModal() {
  return (
    <>
      <UrlField name="href" label="Tumblr URL" required />
      <UrlField name="canonical_url" label="Tumblr Canonical URL" />
    </>
  );
}

export default withBlockModal(TumblrPostBlockModal);
