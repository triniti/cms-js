import React, { useState } from 'react';
import PollPickerField from 'plugins/apollo/components/poll-picker-field';
import {
  FormGroup,
  ModalBody,
} from 'reactstrap';
import { DatePickerField, SwitchField } from 'components';
import { ScrollableContainer } from 'components';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';

const PollGridBlockModal = ({ block }) => {

  const [ hasUpdatedDate, setHasUpdatedDate ] = useState(block.has('updated_date'));

  return (
      <ModalBody className="p-0">
        <ScrollableContainer
          className="bg-gray-400"
          style={{ height: 'calc(100vh - 167px)' }}
        >
          <div className="modal-body-blocksmith">
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
              <FormGroup inline className="d-flex form-group-mobile px-3 mb-2 mt-3">
              <PollPickerField
                  label="Select Polls"
                  className="mr-4"
                  groupClassName="w-100"
                  name="node_refs"
                  isMulti
                  sortable
                  required
                  />
              </FormGroup>
              <FormGroup inline className="d-flex form-group-mobile px-3 mb-2">
                <FormGroup className="mr-4">
                  <SwitchField
                    name="hasUpdatedDate"
                    label="Is Update"
                    checked={hasUpdatedDate}
                    onChange={(e) => setHasUpdatedDate(e.target.checked)}
                    />
                    {hasUpdatedDate
                    && (
                      <DatePickerField
                        label="Updated Date"
                        name="updated_date"
                        />
                    )}
                  <SwitchField
                    name="aside"
                    label="Aside"
                    tooltip="Is only indirectly related to the main content."
                    />
                </FormGroup>
              </FormGroup>
            </div>
          </div>
        </ScrollableContainer>
      </ModalBody>
  );
}

export default withBlockModal(PollGridBlockModal, {
  modalProps: {
    size: 'xxl',
  }
});