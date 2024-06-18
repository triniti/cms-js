import React from 'react';
import PollPickerField from '@triniti/cms/plugins/apollo/components/poll-picker-field/index.js';
import {
  FormGroup,
  ModalBody,
} from 'reactstrap';
import { SwitchField } from '@triniti/cms/components/index.js';
import { ScrollableContainer } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

const PollGridBlockModal = () =>  (
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

export default withBlockModal(PollGridBlockModal, {
  modalProps: {
    size: 'xxl',
  }
});
