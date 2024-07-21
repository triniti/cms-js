import React, { useState } from 'react';
import { FormText } from 'reactstrap';
import { SwitchField, TextareaField, TextField, useFormContext } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

const EMBED_PATTERN = /.*(twitter|x)\.com\/(\w+)\/status\/(\d+).*/;

function TwitterTweetBlockModal() {
  const formContext = useFormContext();
  const [embed, setEmbed] = useState(null);
  const [embedError, setEmbedError] = useState(null);

  const handleChangeEmbed = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const value = event.target.value || '';
    setEmbed(value);

    if (!EMBED_PATTERN.test(value)) {
      setEmbedError('This value doesn\'t look like a Twitter URL or Embed code.');
      return;
    }

    setEmbedError(null);
    const matches = value.match(EMBED_PATTERN);
    const user = matches[2] || undefined;
    const id = matches[3] || undefined;
    let tweet = null;

    if (value.includes('twitter-tweet')) {
      try {
        const parser = new DOMParser();
        const dom = parser.parseFromString(value, 'text/html');
        const p = dom.querySelector('p');
        tweet = p && p.innerHTML || null;
      } catch (e) {
        console.error('TwitterTweetBlockModal.parseTweet', value, e);
      }
    }

    const form = formContext.form;
    form.batch(() => {
      form.change('screen_name', user);
      form.change('tweet_id', id);
      form.change('tweet_text', tweet);
    });
  };

  return (
    <>
      <div className="form-group">
        <textarea
          className="form-control"
          rows={4}
          placeholder="Paste in a Twitter URL or Embed Code"
          onChange={handleChangeEmbed}
        />
        {embed && embedError && <FormText color="danger">{embedError}</FormText>}
      </div>
      <TextField name="screen_name" label="Screen Name" required />
      <TextField name="tweet_id" label="Tweet ID" required />
      <TextareaField name="tweet_text" label="Tweet Text" rows={3} />
      <SwitchField name="hide_media" label="Hide Media" />
      <SwitchField name="hide_thread" label="Hide Thread" />
    </>
  );
}

export default withBlockModal(TwitterTweetBlockModal);
