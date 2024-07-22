import React, { useState } from 'react';
import { FormText } from 'reactstrap';
import { SelectField, TextField, useFormContext } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

const EMBED_PATTERN = /.*open\.spotify\.com\/embed\/(album|artist|episode|playlist|show|track)\/(\w+).*/;

const types = [
  { label: 'album', value: 'album' },
  { label: 'artist', value: 'artist' },
  { label: 'episode', value: 'episode' },
  { label: 'playlist', value: 'playlist' },
  { label: 'show', value: 'show' },
  { label: 'track', value: 'track' },
];

function SpotifyEmbedBlockModal() {
  const { editMode, form } = useFormContext();
  const [embed, setEmbed] = useState(null);
  const [embedError, setEmbedError] = useState(null);

  const handleChangeEmbed = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const value = event.target.value || '';
    setEmbed(value);

    if (!EMBED_PATTERN.test(value)) {
      setEmbedError('This value doesn\'t look like a Spotify Embed code.');
      return;
    }

    setEmbedError(null);
    const matches = value.match(EMBED_PATTERN);
    const type = matches[1] || undefined;
    const id = matches[2] || undefined;

    form.batch(() => {
      form.change('spotify_type', type);
      form.change('spotify_id', id);
    });
  };

  return (
    <>
      {editMode && (
        <div className="form-group">
          <textarea
            className="form-control"
            rows={4}
            placeholder="Paste in a Spotify Embed Code"
            onChange={handleChangeEmbed}
          />
          {embed && embedError && <FormText color="danger">{embedError}</FormText>}
        </div>
      )}
      <SelectField name="spotify_type" label="Spotify Type" options={types} required />
      <TextField name="spotify_id" label="Spotify ID" required />
    </>
  );
}

export default withBlockModal(SpotifyEmbedBlockModal);
