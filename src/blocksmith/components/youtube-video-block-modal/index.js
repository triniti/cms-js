import React from 'react';
import { TextField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';
import getYouTubeId from '@triniti/cms/utils/getYouTubeId.js';

function YoutubeVideoBlockModal(props) {
  console.log('YoutubeVideoBlockModal', props);
  return (
    <>
      <TextField
        name="id"
        label="YouTube Video ID"
        parse={getYouTubeId}
        required
        placeholder="Paste in a YouTube URL or Video ID"
      />
    </>
  );
}

export default withBlockModal(YoutubeVideoBlockModal);
