import React from 'react';
import { KeyValuesField, SelectField, SwitchField, TextField, UrlField, useFormContext } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';
import parseIframeSrc from '@triniti/cms/blocksmith/utils/parseIframeSrc.js';

const align = [
  { label: 'center', value: 'center' },
  { label: 'left', value: 'left' },
  { label: 'right', value: 'right' },
];

function IframeBlockModal() {
  const { form } = useFormContext();

  const handleSrcChange = (event) => {
    const value = event.target.value || '';
    const parsedSrc = parseIframeSrc(value);
    
    if (parsedSrc) {
      form.change('src', parsedSrc);
    } else {
      form.change('src', value);
    }
  };

  return (
    <>
      <UrlField 
        name="src" 
        label="Source URL" 
        required 
        onChange={handleSrcChange}
      />
      <TextField name="width" label="Width" description="In pixels or percent, e.g. 200px or 100%" />
      <TextField name="height" label="Height" description="In pixels or percent, e.g. 200px or 100%" />
      <SelectField name="align" label="Align" options={align} ignoreUnknownOptions />
      <SwitchField name="scrolling_enabled" label="Scrolling Enabled" />
      <KeyValuesField name="data" label="HTML data-* Attributes" component={TextField} />
    </>
  );
}

export default withBlockModal(IframeBlockModal);
