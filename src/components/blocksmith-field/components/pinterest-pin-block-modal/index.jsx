import React from 'react';
import { ModalBody } from 'reactstrap';
import { SelectField, SwitchField, TextareaField } from 'components';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';
import getPinterestPinUrl from 'components/blocksmith-field/components/pinterest-pin-block-modal/getPinterestPinUrl';

const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'medium', value: 'medium' },
  { label: 'large', value: 'large' },
];

function PinterestPinBlockModal() {
  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField
          name="href"
          label="Pinterest ID"
          placeholder="enter pinterest pin id, url, or embed code"
          description="e.g. https://www.pinterest.com/pin/PIN_ID"
          parse={getPinterestPinUrl}
          required
        />
        <SelectField name="size" label="Size" options={sizeOptions} />
        <SwitchField name="aside" label="Aside" tooltip="Is only indirectly related to the main content." />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(PinterestPinBlockModal);
