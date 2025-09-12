import React from 'react';
import VideoPickerField from '@triniti/cms/plugins/ovp/components/video-picker-field/index.js';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal.js';

function VideoTeaserModal() {
  return (
    <>
      <VideoPickerField name="target_ref" label="Target Video" required />
    </>
  );
}

export default withTeaserModal(VideoTeaserModal);
