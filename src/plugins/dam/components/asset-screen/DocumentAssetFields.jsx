import React from 'react';
import classNames from 'classnames';
import { DatePickerField, TextareaField, TextField } from 'components';
import PicklistField from 'plugins/sys/components/picklist-field';

export default function DocumentAssetFields(props) {
  const {asset, groupClassName = ''} = props  

  const rootClassName = classNames(
    groupClassName,
     'form-group',
  );  
  return (
    <div className={rootClassName}>
      <TextField name="title" label="Title" />
      <PicklistField name="credit" label="Credit" picklist="document-asset-credits" />
      <DatePickerField name="expires_at" label="Expires At" />
      <TextareaField name="description" label="Description" />
    </div>  
  );
}
