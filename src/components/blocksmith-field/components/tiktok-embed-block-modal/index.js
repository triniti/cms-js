import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/components/blocksmith-field/components/with-block-modal/index.js';
import getTikTokId from '@triniti/cms/components/blocksmith-field/components/tiktok-embed-block-modal/getTikTokId.js';
import Preview from '@triniti/cms/components/blocksmith-field/components/tiktok-embed-block-modal/Preview.js';

function TiktokEmbedBlockModal(props) {
  const { formState } = props;
  const { valid } = formState;
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
        <SwitchField name="aside" label="Aside" tooltip="Is only indirectly related to the main content." />
        { valid && <Preview {...props} /> }
      </ModalBody>
    </div>
  );
}

export default withBlockModal(TiktokEmbedBlockModal);
