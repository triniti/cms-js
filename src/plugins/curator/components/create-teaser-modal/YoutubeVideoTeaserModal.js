import React from 'react';
import { ModalBody } from 'reactstrap';
import { TextField } from '@triniti/cms/components/index.js';
import getYouTubeId from '@triniti/cms/utils/getYouTubeId.js';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal.js';

function YoutubeVideoTeaserModal() {
  return (
    <ModalBody>
      <TextField name="title" label="Title" required />
      <TextField name="youtube_video_id" label="YouTube URL or Video ID" parse={getYouTubeId} required />
      <TextField name="youtube_custom_id" label="YouTube Custom URL or Video ID" parse={getYouTubeId} />
    </ModalBody>
  );
}

export default withTeaserModal(YoutubeVideoTeaserModal);
