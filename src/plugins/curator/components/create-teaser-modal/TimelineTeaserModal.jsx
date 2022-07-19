import React from 'react';
import { ModalBody } from 'reactstrap';
import TimelinePickerField from 'plugins/curator/components/timeline-picker-field';
import withTeaserModal from 'plugins/curator/components/create-teaser-modal/withTeaserModal';

function TimelineTeaserModal() {
  return (
    <ModalBody>
      <TimelinePickerField name="target_ref" label="Target Timeline" required />
    </ModalBody>
  );
}

export default withTeaserModal(TimelineTeaserModal);
