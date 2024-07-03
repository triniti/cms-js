import React from 'react';
import { DatePickerField, TextareaField, TextField } from '@triniti/cms/components/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import { Button } from 'reactstrap';
import noop from 'lodash-es/noop.js';

export default function CommonFields(props) {
  const {
    allowMultiUpload = true,
    credit,
    form,
    hasMultipleFiles = false,
    onApplyAllCredit = noop,
    onApplyAllExpiresAt = noop,
  } = props;

  return (
    <>
      <TextField name="title" label="Title" />
      <TextField name="display_title" label="Display title" />
      <TextField name="alt_text" label="Alt text" />
      {!allowMultiUpload && (<PicklistField name="credit" label="Credit" picklist={credit} />)}
      {allowMultiUpload && (
        <div className="d-flex">
          <div className="pt-2 pb-2 pe-2 flex-grow-1">
            <PicklistField name="credit" label="Credit" picklist={credit} />
          </div>
          <div className="pt-2 pb-2 ps-2 d-flex align-items-end mb-2">
            <Button
              color="light"
              style={{marginBottom: "0.8rem"}}
              disabled={!hasMultipleFiles || !form.getFieldState('credit')?.dirty}
              onClick={onApplyAllCredit}
              >
              Apply to all
            </Button>
          </div>
        </div>
      )}
      {!allowMultiUpload && (<DatePickerField name="expires_at" label="Expires At" />)}
      {allowMultiUpload && (
        <div className="d-flex">
          <div className="flex-grow-1">
            <DatePickerField name="expires_at" label="Expires At" />
          </div>
          <div className="d-flex align-items-end mb-2">
            <Button
              color="light"
              style={{marginBottom: '0.8rem'}}
              disabled={!hasMultipleFiles || !form.getFieldState('expires_at')?.dirty}
              onClick={onApplyAllExpiresAt}
              >
              Apply to all
            </Button>
          </div>
        </div>
      )}
      <TextareaField name="description" label="Description" />
    </>
  );
}
