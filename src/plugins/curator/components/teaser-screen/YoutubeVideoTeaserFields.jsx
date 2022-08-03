import React from 'react';
import { TextField } from 'components';
import getYouTubeId from 'utils/getYouTubeId';

export default function YoutubeVideoTeaserFields() {
  return (
    <>
      <TextField name="youtube_video_id" label="YouTube URL or Video ID" parse={getYouTubeId} required />
      <TextField name="youtube_custom_id" label="YouTube Custom URL or Video ID" parse={getYouTubeId} />
    </>
  );
}
