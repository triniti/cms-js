import React from 'react';
import startCase from 'lodash-es/startCase';
import { EnumField, KeyValuesField, SwitchField, TextField, UrlField } from 'components';
import AdSizeEnum from '@triniti/schemas/triniti/common/enums/AdSize';

const filter = option => option.value !== 'unknown';
const format = label => startCase(label.toLowerCase());

export default function AdWidgetFields() {
  return (
    <>
      <EnumField
        label="Ad Size"
        name="ad_size"
        enumClass={AdSizeEnum}
        filter={filter}
        format={format}
      />
      <TextField name="dfp_ad_unit_path" label="DFP AD UNIT PATH" />
      <KeyValuesField name="dfp_cust_params" label="DFP Custom Parameters" component={TextField} />
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
