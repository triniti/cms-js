import React from 'react';
import { TextField } from '@triniti/cms/components/index.js';
import getYouTubeId from '@triniti/cms/utils/getYouTubeId.js';

export default function YoutubeVideoTeaserFields() {
  return (
    <>
      <TextField name="youtube_video_id" label="YouTube Video ID" parse={getYouTubeId} required placeholder="Paste in a YouTube URL or Video ID" />
      <TextField name="youtube_custom_id" label="YouTube Custom ID" />
    </>
  );
}
