import React, { useState } from 'react';
import { SwitchField, TextField, useFormContext } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';
import { FormText } from 'reactstrap';

const EMBED_PATTERN = /.*\/\/.*(instagram\.com|instagr\.am).*\/(p|reels?)\/([\w-]+).*/;

function InstagramMediaBlockModal() {
  const { editMode, form } = useFormContext();
  const [embed, setEmbed] = useState(null);
  const [embedError, setEmbedError] = useState(null);

  const handleChangeEmbed = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const value = event.target.value || '';
    setEmbed(value);

    if (!EMBED_PATTERN.test(value)) {
      setEmbedError('This value doesn\'t look like an Instagram Media URL or Embed code.');
      return;
    }

    setEmbedError(null);
    const id = value.match(EMBED_PATTERN)[3] || undefined;

    form.batch(() => {
      form.change('id', id);
      form.change('hidecaption', value.includes('instgrm-permalink') && !value.includes('instgrm-captioned'));
    });
  };

  return (
    <>
      {editMode && (
        <div className="form-group">
          <textarea
            className="form-control"
            rows={4}
            placeholder="Paste in an Instagram Media URL or Embed code"
            onChange={handleChangeEmbed}
          />
          {embed && embedError && <FormText color="danger">{embedError}</FormText>}
        </div>
      )}
      <TextField name="id" label="Instagram Media ID" required />
      <SwitchField name="hidecaption" label="Hide Caption" />
    </>
  );
}

export default withBlockModal(InstagramMediaBlockModal);
