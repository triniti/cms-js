import React from 'react';
import { KeyValuesField, SelectField, SwitchField, TextField, UrlField } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

const align = [
  { label: 'center', value: 'center' },
  { label: 'left', value: 'left' },
  { label: 'right', value: 'right' },
];

function IframeBlockModal() {
  return (
    <>
      <UrlField name="src" label="Source URL" required />
      <TextField name="width" label="Width" description="In pixels or percent, e.g. 200px or 100%" />
      <TextField name="height" label="Height" description="In pixels or percent, e.g. 200px or 100%" />
      <SelectField name="align" label="Align" options={align} ignoreUnknownOptions />
      <SwitchField name="scrolling_enabled" label="Scrolling Enabled" />
      <KeyValuesField name="data" label="HTML data-* Attributes" component={TextField} />
    </>
  );
}

export default withBlockModal(IframeBlockModal);
