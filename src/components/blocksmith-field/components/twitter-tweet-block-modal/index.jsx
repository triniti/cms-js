import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField } from 'components';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';


function TwitterTweetEmbedBlockModal() {
  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField name="tweet_id" label="Embed Code" placeholder="enter embed code" />
        <SwitchField name="hide_media" label="Hide Media" />
        <SwitchField name="hide_thread" label="Hide Thread" />
        <SwitchField name="aside" label="Aside" />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(TwitterTweetEmbedBlockModal);
