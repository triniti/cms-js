import React from 'react';
import { DatePickerField, TextareaField, TextField, UrlField } from '@triniti/cms/components/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field';

export default function CommonFields(props) {
  const { credit } = props;

  return (
    <>
      <TextField name="title" label="Title" />
      <TextField name="display_title" label="Display title" />
      <TextField name="alt_text" label="Alt text" />
      <PicklistField name="credit" label="Credit" picklist={credit} />
      <UrlField name="credit_url" label="Credit Url" />
      <TextField name="cta_text" label="CTA text"/>
      <UrlField name="cta_url" label="CTA Url" />
      <DatePickerField name="expires_at" label="Expires At" />
      <TextareaField name="description" label="Description" />
    </>
  );
}
