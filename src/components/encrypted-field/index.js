import React from 'react';
import TextareaField from '@triniti/cms/components/textarea-field/index.js';

const ENCRYPTED_VALUE_PATTERN = /^[a-f0-9]{150,}$/;

const validator = (value) => {
  const val = `${value || ''}`.trim();
  if (!val || (val.startsWith('def') && ENCRYPTED_VALUE_PATTERN.test(val))) {
    return undefined;
  }

  return `Only use values encrypted with "symfony crypto:encrypt" by a sysadmin for the ${APP_ENV} environment.`;
};

export default function EncryptedField(props) {
  return <TextareaField {...props} validator={validator} />;
}
