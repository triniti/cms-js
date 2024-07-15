import React from 'react';
import { SelectField, TextareaField, UrlField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

const sizes = [
  { label: 'H1 - Heading 1', value: 1 },
  { label: 'H2 - Heading 2', value: 2 },
  { label: 'H3 - Heading 3', value: 3 },
  { label: 'H4 - Heading 4', value: 4 },
  { label: 'H5 - Heading 5', value: 5 },
  { label: 'H6 - Heading 6', value: 6 },
];

function HeadingBlockModal() {
  return (
    <>
      <TextareaField name="text" label="Text" row={2} required />
      <SelectField name="size" label="Size" options={sizes} ignoreUnknownOptions />
      <UrlField name="url" label="URL" />
    </>
  );
}

export default withBlockModal(HeadingBlockModal);
