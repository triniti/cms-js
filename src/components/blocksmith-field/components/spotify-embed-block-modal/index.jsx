import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField } from 'components';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';

const SPOTIFY_EMBED_REGEX = /^<iframe.+?spotify\.com\/embed\/track\/[0-9A-Za-z]{22}.*?<\/iframe>$/;
const SPOTIFY_SONG_LINK_REGEX = /^https?:\/\/open\.spotify\.com\/track\/[0-9A-Za-z]{22}.*$/;
const SPOTIFY_URI_REGEX = /^spotify:track:[0-9A-Za-z]{22}$/;
const SPOTIFY_TRACK_ID_REGEX = /^[0-9A-Za-z]{22}$/;

const validator = (value) => {
  if (!(SPOTIFY_EMBED_REGEX.test(value)
    || SPOTIFY_SONG_LINK_REGEX.test(value)
    || SPOTIFY_TRACK_ID_REGEX.test(value)
    || SPOTIFY_URI_REGEX.test(value))
  ) {
    return 'url or embed code is invalid';
  }

  return undefined;
};

function SpotifyEmbedBlockModal() {
  return (
    <ModalBody>
      <TextareaField
        name="spotify_id"
        label="Embed code, Link, URI, or id"
        placeholder="enter embed code"
        validator={validator}
        required
      />
      <SwitchField name="aside" label="Aside" tooltip="Is only indirectly related to the main content." />
    </ModalBody>
  );
}

export default withBlockModal(SpotifyEmbedBlockModal);
