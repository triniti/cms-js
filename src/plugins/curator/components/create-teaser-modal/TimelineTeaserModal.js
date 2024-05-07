import React from 'react';
import { ModalBody } from 'reactstrap';
import TimelinePickerField from '@triniti/cms/plugins/curator/components/timeline-picker-field/index.js';
import withTeaserModal from '@triniti/cms/plugins/curator/components/create-teaser-modal/withTeaserModal.js';

function TimelineTeaserModal() {
  return (
    <ModalBody>
      <TimelinePickerField name="target_ref" label="Target Timeline" required />
    </ModalBody>
  );
}

export default withTeaserModal(TimelineTeaserModal);
