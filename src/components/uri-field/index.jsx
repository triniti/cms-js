import React from 'react';
import TextField from 'components/text-field';

const normalize = value => `${value || ''}`.trim().replace(/\s/g, '-').replace(/\/{2,}/g, '/');

const validator = (value) => {
  const normalized = normalize(value);
  if (!normalized.startsWith('/')) {
    return 'Must start with /.';
  }

  return undefined;
};

export default function UriField(props) {
  return <TextField {...props} parse={normalize} format={normalize} validator={validator} />;
}
