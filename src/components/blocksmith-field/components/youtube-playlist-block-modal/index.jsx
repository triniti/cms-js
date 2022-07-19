import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField } from 'components';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';
import getYoutubePlaylistId from "components/blocksmith-field/components/youtube-playlist-block-modal/getYoutubePlaylistId";

function YoutubePlaylistBlockModal() {
  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField
          name="playlist_id"
          label="Youtube Playlist Id"
          placeholder="enter embed code, url, or id"
          parse={getYoutubePlaylistId}
          required
        />
        {/* fixme: add image picker when it's ready */}
        <SwitchField name="aside" label="Aside" />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(YoutubePlaylistBlockModal);
