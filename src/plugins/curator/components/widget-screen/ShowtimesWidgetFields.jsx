import React from 'react';
import { SwitchField, TextareaField, TextField, UrlField } from 'components';
import ImagePickerField from 'plugins/dam/components/image-picker-field';
import PicklistField from 'plugins/sys/components/picklist-field';

export default function ShowtimesWidgetFields(props) {
  const { node, nodeRef } = props;

  return (
    <>
      <PicklistField name="show" label="Show" picklist="video-shows" />
      <TextField name="headline" label="Headline" />
      <TextareaField name="excerpt" label="Excerpt" />
      <ImagePickerField name="image_ref" label="Image" nodeRef={nodeRef} />
      <SwitchField name="show_header" label="Show Header" />
      <SwitchField name="show_border" label="Show Border" />
      <SwitchField name="include_latest_episode" label="Include Latest Episode" />
      <SwitchField name="include_latest_promo" label="Include Latest Promo" />
      <TextField name="header_text" label="Header Text" />
      {node.schema().hasMixin('triniti:common:mixin:themeable') && (
        <PicklistField name="theme" label="Theme" picklist="showtimes-widget-themes" />
      )}
      <TextField name="view_all_text" label="View All Text" />
      <UrlField name="view_all_url" label="View All Url" />
      <TextField name="partner_text" label="Partner Text" />
      <UrlField name="partner_url" label="Partner Url" />
    </>
  );
}
