import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormText, Input, Label } from '@triniti/admin-ui-plugin/components';

const MetaDescriptionTextareaField = ({
  input, label, meta: { touched, error, warning }, readOnly, hasBorder, rows, maxLength, ...rest
}) => {
  const readOnlyField = readOnly ? 'readonly' : null;
  const borderClass = hasBorder ? 'has-border' : null;

  const value = input.value || '';
  const metaDescriptionLength = value.length;
  let metaDescriptionStyle = 'info';
  if (metaDescriptionLength >= 160) {
    metaDescriptionStyle = 'danger';
  } else if (metaDescriptionLength >= 140) {
    metaDescriptionStyle = 'warning';
  }

  return (
    <FormGroup className={borderClass}>
      {label && <Label for={input.name}>{label}</Label>}
      <Input id={input.name} valid={touched && !error} invalid={touched && !!error} {...input} {...rest} type="textarea" rows={rows} readOnly={readOnlyField} disabled={readOnly} />      
      <FormText color={metaDescriptionStyle} className="ml-1">
        {maxLength - metaDescriptionLength} characters remaining.
      </FormText>
    </FormGroup>
  );
};

MetaDescriptionTextareaField.propTypes = {
  input: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxLength: PropTypes.number,
  meta: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  readOnly: PropTypes.bool,
  hasBorder: PropTypes.bool,
  rows: PropTypes.number,
};

MetaDescriptionTextareaField.defaultProps = {
  label: '',
  maxLength: 500,
  readOnly: false,
  hasBorder: false,
  rows: 5,
};

export default MetaDescriptionTextareaField;
