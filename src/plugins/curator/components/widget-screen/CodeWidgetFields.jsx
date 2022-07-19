import React from 'react';
import { SwitchField, TextareaField, TextField, UrlField } from 'components';

export default function CodeWidgetFields() {
  return (
    <>
      <TextareaField name="code" label="Code" />
      <SwitchField name="show_header" label="Show Header" />
      <SwitchField name="show_border" label="Show Border" />
      <TextField name="header_text" label="Header Text" />
      <TextField name="view_all_text" label="View All Text" />
      <UrlField name="view_all_url" label="View All Url" />
      <TextField name="partner_text" label="Partner Text" />
      <UrlField name="partner_url" label="Partner Url" />
    </>
  );
}
