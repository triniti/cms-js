import React from 'react';
import { SwitchField, TextField, UrlField } from '@triniti/cms/components/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';

export default function AlertWidgetFields(props) {
  const { node } = props;

  return (
    <>
      <SwitchField name="show_header" label="Show Header" />
      <SwitchField name="show_border" label="Show Border" />
      <SwitchField name="dismissible" label="Dismissible" />
      <TextField name="header_text" label="Header Text" />
      {node.schema().hasMixin('triniti:common:mixin:themeable') && (
        <PicklistField name="theme" label="Theme" picklist="alert-widget-themes" />
      )}
      <TextField name="view_all_text" label="View All Text" />
      <UrlField name="view_all_url" label="View All Url" />
      <TextField name="partner_text" label="Partner Text" />
      <UrlField name="partner_url" label="Partner Url" />
    </>
  );
}