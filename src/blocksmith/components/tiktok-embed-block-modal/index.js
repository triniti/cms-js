import React, { useState } from 'react';
import { FormText } from 'reactstrap';
import { TextField, useFormContext } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

const EMBED_PATTERN = /.*tiktok\.com\/[^\/]+\/video\/(\d+).*/;

function TiktokEmbedBlockModal() {
  const formContext = useFormContext();
  const [embed, setEmbed] = useState(null);
  const [embedError, setEmbedError] = useState(null);

  const handleChangeEmbed = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const value = event.target.value || '';
    setEmbed(value);

    if (!EMBED_PATTERN.test(value)) {
      setEmbedError('This value doesn\'t look like a TikTok Embed code.');
      return;
    }

    setEmbedError(null);
    const id = value.match(EMBED_PATTERN)[1] || undefined;
    formContext.form.change('tiktok_id', id);
  };

  return (
    <>
      <div className="form-group">
        <textarea
          className="form-control"
          rows={4}
          placeholder="Paste in a TikTok Embed Code"
          onChange={handleChangeEmbed}
        />
        {embed && embedError && <FormText color="danger">{embedError}</FormText>}
      </div>
      <TextField name="tiktok_id" label="TikTok ID" required />
    </>
  );
}

export default withBlockModal(TiktokEmbedBlockModal);
