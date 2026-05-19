import React from 'react';
import { TextField } from '@triniti/cms/components/index.js';
import TimelinePickerField from '@triniti/cms/plugins/curator/components/timeline-picker-field/index.js';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal.js';

function LiveBlogUpdateTeaserModal() {
  return (
    <>
      <TextField name="title" label="Title" required />
      <TimelinePickerField name="timeline_ref" label="Timeline" required />
    </>
  );
}

export default withTeaserModal(LiveBlogUpdateTeaserModal);
