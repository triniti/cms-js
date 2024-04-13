import React, { useState } from 'react';
import { Label, ModalBody } from 'reactstrap';
import { SwitchField, TextField } from '@triniti/cms/components';
import { FormGroup, Input } from 'reactstrap';
import withBlockModal from '@triniti/cms/components/blocksmith-field/components/with-block-modal';
import getSpotifyMediaId from '@triniti/cms/components/blocksmith-field/components/spotify-embed-block-modal/getSpotifyMediaId';
import Preview from './Preview';

const SPOTIFY_EMBED_REGEX = /^<iframe.+?spotify\.com\/embed\/track\/[0-9A-Za-z]{22}.*?<\/iframe>$/;
const SPOTIFY_SONG_LINK_REGEX = /^https?:\/\/open\.spotify\.com\/track\/[0-9A-Za-z]{22}.*$/;
const SPOTIFY_URI_REGEX = /^spotify:track:[0-9A-Za-z]{22}$/;
const SPOTIFY_TRACK_ID_REGEX = /^[0-9A-Za-z]{22}$/;

// const validator = (value) => {
//   if (!(SPOTIFY_EMBED_REGEX.test(value)
//     || SPOTIFY_SONG_LINK_REGEX.test(value)
//     || SPOTIFY_TRACK_ID_REGEX.test(value)
//     || SPOTIFY_URI_REGEX.test(value))
//   ) {
//     return 'url or embed code is invalid';
//   }

//   return undefined;
// };

function SpotifyEmbedBlockModal(props) {
  const { form, formState } = props;
  const { valid } = formState;
  const [ textareaValue, setTextareaValue ] = useState();

  const parseSpotifyId = (input) => {
    const data = getSpotifyMediaId(input.target.value);
    if (data === undefined) {
      return;
    }
    form.change('spotify_type', data.type);
    form.change('spotify_id', data.id);
    setTextareaValue(`spotify:${data.type}:${data.id}`);
    return '';
  }

  return (
    <ModalBody>
      <FormGroup>
        <Label for="spotify-embed-block-modal-textarea">Embed code, Link, URI, or track id</Label>
        <Input
          name="spotify-embed-block-modal-textarea"
          type="textarea"
          onChange={(e) => parseSpotifyId(e)}
          value={textareaValue}
          />
      </FormGroup>
      <SwitchField name="aside" label="Aside" tooltip="Is only indirectly related to the main content." />
      {valid && <Preview {...props} />}
      <div style={{ display: 'none' }}>
        <TextField name="spotify_type" required />
        <TextField name="spotify_id" required />
      </div>
    </ModalBody>
  );
}

export default withBlockModal(SpotifyEmbedBlockModal);
