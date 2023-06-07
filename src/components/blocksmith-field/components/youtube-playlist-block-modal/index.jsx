import React from "react";
import { ModalBody } from "reactstrap";
import { SwitchField, TextareaField } from "components";
import withBlockModal from "components/blocksmith-field/components/with-block-modal";
import getYoutubePlaylistId from "components/blocksmith-field/components/youtube-playlist-block-modal/getYoutubePlaylistId";
import Preview from "./Preview";
import ImagePickerField from 'plugins/dam/components/image-picker-field';

function YoutubePlaylistBlockModal(props) {
  const { formState } = props;
  const { valid } = formState;
  const { playlist_id: playlistId, } = formState.values;

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
        {valid && (<Preview {...props} />)}
        {playlistId && <ImagePickerField name="poster_image_ref" previewImage={false} />}
        <SwitchField name="autoplay" label="Autoplay" />
        <SwitchField name="aside" label="Aside" tooltip="Is only indirectly related to the main content." />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(YoutubePlaylistBlockModal);
