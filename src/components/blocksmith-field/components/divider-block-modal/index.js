import React from 'react';
import { ModalBody } from 'reactstrap';
import { TextareaField, SelectField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/components/blocksmith-field/components/with-block-modal/index.js';
import DividerBlockPreview from '@triniti/cms/components/blocksmith-field/components/divider-block-modal/DividerBlockPreview.js';

const strokeColorOptions = [
  { label: 'primary', value: 'primary' },
  { label: 'secondary', value: 'secondary' },
];

const strokeStyleOptions = [
  { label: 'solid (default)', value: 'solid' },
  { label: 'dotted', value: 'dotted' },
  { label: 'dashed', value: 'dashed' },
];

function DividerBlockModal(props) {

  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField name="text" label="Text" placeholder="Enter heading text here" />
        <SelectField name="stroke_color" label="Stroke Color" options={strokeColorOptions} required />
        <SelectField name="stroke_style" label="Stroke Style" options={strokeStyleOptions} required />
        <DividerBlockPreview {...props} />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(DividerBlockModal);
