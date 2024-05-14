import React from 'react';
import { ModalBody } from 'reactstrap';
import VideoPickerField from '@triniti/cms/plugins/ovp/components/video-picker-field/index.js';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal.js';

function VideoTeaserModal() {
  return (
    <ModalBody>
      <VideoPickerField name="target_ref" label="Target Video" required />
    </ModalBody>
  );
}

export default withTeaserModal(VideoTeaserModal);