import React from 'react';
import { ModalBody } from 'reactstrap';
import { SelectField, SwitchField, TextareaField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';
import getPinterestPinUrl from '@triniti/cms/blocksmith/components/pinterest-pin-block-modal/getPinterestPinUrl.js';
import Preview from '@triniti/cms/blocksmith/components/pinterest-pin-block-modal/Preview.js';

const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'medium', value: 'medium' },
  { label: 'large', value: 'large' },
];

function PinterestPinBlockModal(props) {
  const { formState } = props;
  const { valid } = formState;

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
        <SwitchField name="terse" label="Hide description" />
        <SwitchField name="aside" label="Aside" tooltip="Is only indirectly related to the main content." />
        {valid && <Preview {...props} />}
      </ModalBody>
    </div>
  );
}

export default withBlockModal(PinterestPinBlockModal);
