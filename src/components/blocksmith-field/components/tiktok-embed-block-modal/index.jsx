import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField } from 'components';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';
import getTikTokId from 'components/blocksmith-field/components/tiktok-embed-block-modal/getTikTokId';

function TiktokEmbedBlockModal() {
  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField
          name="tiktok_id"
          label="TikTok Embed Code, URL, or ID"
          placeholder="enter embed code, url, or id"
          parse={getTikTokId}
          required
        />
        <SwitchField name="aside" label="Aside" />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(TiktokEmbedBlockModal);
