import React from 'react';
import ChannelPickerField from '@triniti/cms/plugins/taxonomy/components/channel-picker-field/index.js';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal.js';

function ChannelTeaserModal() {
  return (
    <>
      <ChannelPickerField name="target_ref" label="Target Channel" required />
    </>
  );
}

export default withTeaserModal(ChannelTeaserModal);
