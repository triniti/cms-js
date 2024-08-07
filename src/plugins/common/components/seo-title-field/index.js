import React from 'react';
import { TextField } from '@triniti/cms/components/index.js';
import { FormText } from 'reactstrap';

function Warning(props) {
  const { value } = props;
  if (!value) {
    return null;
  }

  const length = `${value || ''}`.length;
  if (length < 60) {
    return null;
  }

  return (
    <FormText color={length > 75 ? 'danger' : 'warning'} className="d-block">
      Use less than 60 characters to avoid getting truncated in search results.
      ({length}/60)
    </FormText>
  );
}

export default function SeoTitleField(props) {
  const { name = 'title', label = 'Title', required = true, ...rest } = props;
  return (
    <TextField
      {...rest}
      name={name}
      label={label}
      required={required}
      Warning={Warning}
    />
  );
}
