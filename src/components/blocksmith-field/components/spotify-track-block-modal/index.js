import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField } from 'components';
import withBlockModal from '@triniti/cms/components/blocksmith-field/components/with-block-modal';
import Preview from './Preview';

const SPOTIFY_EMBED_REGEX = /^<iframe.+?spotify\.com\/embed\/track\/[0-9A-Za-z]{22}.*?<\/iframe>$/;
const SPOTIFY_SONG_LINK_REGEX = /^https?:\/\/open\.spotify\.com\/track\/[0-9A-Za-z]{22}.*$/;
const SPOTIFY_URI_REGEX = /^spotify:track:[0-9A-Za-z]{22}$/;
const SPOTIFY_TRACK_ID_REGEX = /^[0-9A-Za-z]{22}$/;

const parseTrackId = (input) => {
  if (!(SPOTIFY_EMBED_REGEX.test(input)
    || SPOTIFY_SONG_LINK_REGEX.test(input)
    || SPOTIFY_TRACK_ID_REGEX.test(input)
    || SPOTIFY_URI_REGEX.test(input))
  ) {
    return input;
  } else {
    if (SPOTIFY_EMBED_REGEX.test(input) || SPOTIFY_SONG_LINK_REGEX.test(input)) {
      return input.match(/track\/[0-9A-Za-z]{22}/)[0].replace('track/', '');
    } else if (SPOTIFY_URI_REGEX.test(input)) {
      return input.split(':')[2];
    } else if (SPOTIFY_TRACK_ID_REGEX.test(input)) {
      return input;
    }
  }
}

function SpotifyTrackBlockModal(props) {
  const { formState } = props;
  const { valid } = formState;

  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField name="track_id" label="Embed code, Link, URI, or track id" placeholder="enter embed code" parse={parseTrackId} />
        <SwitchField name="aside" label="Aside" tooltip="Is only indirectly related to the main content." />
        {valid && <Preview {...props} />}
      </ModalBody>
    </div>
  );
}

export default withBlockModal(SpotifyTrackBlockModal);
