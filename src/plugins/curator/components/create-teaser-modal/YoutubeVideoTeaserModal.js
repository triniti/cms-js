import React from 'react';
import { TextField } from '@triniti/cms/components/index.js';
import parseYouTubeId from '@triniti/cms/utils/parseYouTubeId.js';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal.js';

function YoutubeVideoTeaserModal() {
  return (
    <>
      <TextField name="title" label="Title" required />
      <TextField name="youtube_video_id" label="YouTube Video ID" parse={parseYouTubeId} required placeholder="Paste in a YouTube URL or Video ID" />
    </>
  );
}

export default withTeaserModal(YoutubeVideoTeaserModal);
