import React, { useState } from 'react';
import { ModalBody } from 'reactstrap';
import { SelectField, SwitchField, TextareaField, TextField } from 'components';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';
import IframeBlockPreview from './IframeBlockPreview';

const alignOptions = [
  { label: 'left', value: 'left' },
  { label: 'center', value: 'center' },
  { label: 'right', value: 'right' },
];

function IframeBlockModal(props) {
  const { block, form, formState } = props;
  const { valid } = formState;
  const [hasManualDimensions, setHasManualDimensions] = useState(block.has('height') || block.has('width'));

  const handleDimensionsCheckbox = (checked) => {
    setHasManualDimensions(checked);
    if (!checked) {
      form.change('height', null);
      form.change('width', null);
    } else {
      if (block.has('height')) {
        form.change('height', block.get('height'));
      }

      if (block.has('width')) {
        form.change('width', block.get('width'));
      }
    }
  };

  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField name="src" label="iFrame Source URL" placeholder="Enter iframe source or embed code" error="iFrame source or embed code is invalid" />
        {valid && <IframeBlockPreview {...props} />}
        <SelectField name="align" label="Align" options={alignOptions} />
        <SwitchField
          name="has_manual_dimensions"
          label="Manually adjust dimensions"
          checked={hasManualDimensions}
          onChange={e => handleDimensionsCheckbox(e.target.checked)}
          editMode
        />
        <div className={hasManualDimensions ? 'd-block' : 'd-none'}>
          <TextField name="height" label="Height" />
          <TextField name="width" label="Width" />
        </div>
        <SwitchField name="scrolling_enabled" label="Scrolling" editMode />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(IframeBlockModal);
