import React from 'react';
import { TextField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

function TiktokEmbedBlockModal() {
  return (
    <>
      <TextField name="tiktok_id" label="TikTok ID" required />
    </>
  );
}

export default withBlockModal(TiktokEmbedBlockModal);
