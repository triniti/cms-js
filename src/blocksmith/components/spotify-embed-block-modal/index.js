import React from 'react';
import { SelectField, TextField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

const types = [
  { label: 'album', value: 'album' },
  { label: 'artist', value: 'artist' },
  { label: 'episode', value: 'episode' },
  { label: 'playlist', value: 'playlist' },
  { label: 'show', value: 'show' },
  { label: 'track', value: 'track' },
];

function SpotifyEmbedBlockModal() {
  return (
    <>
      <SelectField name="spotify_type" label="Spotify Type" options={types} required />
      <TextField name="spotify_id" label="Spotify ID" required />
    </>
  );
}

export default withBlockModal(SpotifyEmbedBlockModal);
