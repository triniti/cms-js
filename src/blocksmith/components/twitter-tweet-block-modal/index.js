import React from 'react';
import { SwitchField, TextareaField, TextField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

function TwitterTweetBlockModal() {
  return (
    <>
      <TextField name="screen_name" label="Screen Name" required />
      <TextField name="tweet_id" label="Tweet ID" required />
      <TextareaField name="tweet_text" label="Tweet Text" rows={3} />
      <SwitchField name="hide_media" label="Hide Media" />
      <SwitchField name="hide_thread" label="Hide Thread" />
    </>
  );
}

export default withBlockModal(TwitterTweetBlockModal);
