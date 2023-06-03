import React from 'react';
import { ModalBody } from 'reactstrap';
import { TextareaField, SelectField, UrlField } from 'components';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';
import HeadingBlockPreview from 'components/blocksmith-field/components/heading-block-modal/HeadingBlockPreview';

const sizeOptions = [
  { label: 'h1', value: 1 },
  { label: 'h2', value: 2 },
  { label: 'h3', value: 3 },
  { label: 'h4', value: 4 },
  { label: 'h5', value: 5 },
  { label: 'h6', value: 6 },
];

function HeadingBlockModal(props) {
  return (
    <div className="modal-scrollable">
      <ModalBody className="modal-scrollable">
        <TextareaField name="text" label="Text"/>
        <SelectField name="size" label="Size" options={sizeOptions} ignoreUnknownOptions required />
        <UrlField name="url" label="URL" />
        <HeadingBlockPreview {...props} />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(HeadingBlockModal);
