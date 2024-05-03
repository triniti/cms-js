import React from 'react';
import { SwitchField, TextField, UrlField } from '@triniti/cms/components/index.js';
import PicklistField from 'plugins/sys/components/picklist-field';

export default function BlogrollWidgetFields(props) {
  const { node } = props;

  return (
    <>
      <TextField name="promotion_slot_prefix" label="Promotion Slot prefix" />
      <SwitchField name="show_header" label="Show Header" />
      <SwitchField name="show_border" label="Show Border" />
      <TextField name="header_text" label="Header Text" />
      {node.schema().hasMixin('triniti:common:mixin:themeable') && (
        <PicklistField name="theme" label="Theme" picklist="blogroll-widget-themes" />
      )}
      <TextField name="view_all_text" label="View All Text" />
      <UrlField name="view_all_url" label="View All Url" />
      <TextField name="partner_text" label="Partner Text" />
      <UrlField name="partner_url" label="Partner Url" />
    </>
  );
}
