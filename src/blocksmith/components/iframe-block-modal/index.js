import React from 'react';
import { KeyValuesField, SelectField, SwitchField, TextField, UrlField, useFormContext } from '@triniti/cms/components/index.js';
import withBlockModal from '@triniti/cms/blocksmith/components/with-block-modal/index.js';

const align = [
  { label: 'center', value: 'center' },
  { label: 'left', value: 'left' },
  { label: 'right', value: 'right' },
];

function IframeBlockModal() {
  const { form } = useFormContext();

  const handleSrcChange = (event) => {
    const value = event.target.value || '';
    
    // Check if the value contains an iframe tag
    if (value.includes('<iframe') && value.includes('src=')) {
      try {
        let srcUrl = null;
        
        // Try DOMParser first
        const parser = new DOMParser();
        const doc = parser.parseFromString(value, 'text/html');
        const iframe = doc.querySelector('iframe');
        
        if (iframe) {
          srcUrl = iframe.getAttribute('src') || iframe.src;
        }
        
        // If DOMParser didn't work, try regex as fallback
        if (!srcUrl) {
          const srcMatch = value.match(/src=["']?([^"'\s>]+)["']?/i);
          if (srcMatch && srcMatch[1]) {
            srcUrl = srcMatch[1];
          }
        }
        
        // If we found a URL, process and update
        if (srcUrl) {
          // Handle scheme-less URLs
          if (srcUrl.startsWith('//')) {
            srcUrl = 'https:' + srcUrl;
          }
          
          form.change('src', srcUrl);
          return;
        }
      } catch (e) {
        // If parsing fails, just use the original value
        console.error('IframeBlockModal: Failed to parse iframe', e);
      }
    }
    
    // If it's not an iframe tag or parsing failed, use the value as-is
    form.change('src', value);
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
