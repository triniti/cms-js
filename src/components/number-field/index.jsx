import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { FormGroup, FormText, InputNumber, Label } from '@triniti/admin-ui-plugin/components';

const NumberField = ({
  className,
  disabled,
  hasBorder,
  input,
  label,
  meta: { touched, error, warning },
  ...rest
}) => (
  <FormGroup className={classNames(className, { 'has-border': hasBorder })}>
    {
      label
      && <Label for={input.name}>{label}</Label>
    }
    <InputNumber
      disabled={disabled}
      id={input.name}
      style={!disabled} /* hides arrows. see "With inline styles disabled" here: http://vlad-ignatov.github.io/react-numeric-input/ */
      {...input}
      {...rest}
    />
    {
      warning
      && <FormText key="warning" color="warning" className="ml-1">{warning}</FormText>
    }
    {
      touched && error
      && <FormText key="error" color="danger" className="ml-1">{error}</FormText>
    }
  </FormGroup>
);

NumberField.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  input: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  meta: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  readOnly: PropTypes.bool,
  hasBorder: PropTypes.bool,
};

NumberField.defaultProps = {
  className: '',
  disabled: false,
  label: '',
  readOnly: false,
  hasBorder: false,
};

export default NumberField;
