import React, { useState } from 'react';
import { FormText } from 'reactstrap';
import { SwitchField, TextField, useFormContext } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

const EMBED_PATTERN = /.*imgur-embed-pub.*data-id=\"([^\"]+)\".*/;

function ImgurPostBlockModal() {
  const formContext = useFormContext();
  const [embed, setEmbed] = useState(null);
  const [embedError, setEmbedError] = useState(null);

  const handleChangeEmbed = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const value = event.target.value || '';
    setEmbed(value);

    if (!EMBED_PATTERN.test(value)) {
      setEmbedError('This value doesn\'t look like an Imgur Embed code.');
      return;
    }

    setEmbedError(null);
    const id = value.match(EMBED_PATTERN)[1] || undefined;

    const form = formContext.form;
    form.batch(() => {
      form.change('id', id);
      form.change('show_context', !value.includes('data-context="false"'));
    });
  };

  return (
    <>
      <div className="form-group">
        <textarea
          className="form-control"
          rows={4}
          placeholder="Paste in an Imgur Embed Code"
          onChange={handleChangeEmbed}
        />
        {embed && embedError && <FormText color="danger">{embedError}</FormText>}
      </div>
      <TextField name="id" label="Imgur Post ID" required />
      <SwitchField name="show_context" label="Show Context" />
    </>
  );
}

export default withBlockModal(ImgurPostBlockModal);
