import React from 'react';
import { ModalBody } from 'reactstrap';
import { SwitchField, TextareaField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';
import getYoutubePlaylistId from '@triniti/cms/blocksmith/components/youtube-playlist-block-modal/getYoutubePlaylistId.js';
import Preview from '@triniti/cms/blocksmith/components/youtube-playlist-block-modal/Preview.js';
import ImagePickerField from '@triniti/cms/plugins/dam/components/image-picker-field/index.js';

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
