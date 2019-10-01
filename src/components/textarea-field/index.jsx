import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormText, Input, Label } from '@triniti/admin-ui-plugin/components';

const TextareaField = ({
  input, label, meta: { touched, error, warning }, readOnly, hasBorder, rows, ...rest
}) => {
  const readOnlyField = readOnly ? 'readonly' : null;
  const borderClass = hasBorder ? 'has-border' : null;

  return (
    <FormGroup className={borderClass}>
      {label && <Label for={input.name}>{label}</Label>}
      <Input id={input.name} valid={touched && !error} invalid={touched && !!error} {...input} {...rest} type="textarea" rows={rows} readOnly={readOnlyField} disabled={readOnly} />
      {
        warning
        && (
          <FormText color={!input.value ? 'info' : 'warning'} className="ml-1">
            {warning}
          </FormText>
        )
      }
      {touched && error && <FormText color="danger" className="ml-1">{error}</FormText>}
    </FormGroup>
  );
};

TextareaField.propTypes = {
  input: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  meta: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  readOnly: PropTypes.bool,
  hasBorder: PropTypes.bool,
  rows: PropTypes.number,
};

TextareaField.defaultProps = {
  label: '',
  readOnly: false,
  hasBorder: false,
  rows: 5,
};

export default TextareaField;
