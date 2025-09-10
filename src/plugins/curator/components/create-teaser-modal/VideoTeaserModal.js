import React from 'react';
import VideoPickerField from '@triniti/cms/plugins/ovp/components/video-picker-field/index.js';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal.js';
import NodeStatus from "@gdbots/schemas/gdbots/ncr/enums/NodeStatus.js";

function VideoTeaserModal() {
  return (
    <>
      <VideoPickerField name="target_ref" label="Target Video" statuses={[NodeStatus.PENDING, NodeStatus.PUBLISHED, NodeStatus.SCHEDULED]} required />
    </>
  );
}

export default withTeaserModal(VideoTeaserModal);
