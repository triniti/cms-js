import { FormGroup, FormText, Label, Select } from '@triniti/admin-ui-plugin/components';
import noop from 'lodash/noop';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const SelectField = ({
  disabled,
  formGroupClassName,
  formGroupStyle,
  hasBorder,
  input,
  label,
  meta: { error },
  multi,
  onInputChange: handleInputChange,
  ...rest
}) => {
  const arrowRenderer = rest.creatable ? () => null : undefined;
  const borderClass = hasBorder ? 'has-border' : null;

  return (
    <FormGroup className={classNames(borderClass, formGroupClassName)} style={formGroupStyle}>
      {label && <Label for={input.name}>{label}</Label>}
      <Select
        arrowRenderer={arrowRenderer}
        classNamePrefix="Select"
        isDisabled={disabled}
        multi={multi}
        name={input.name}
        onBlur={() => input.onBlur(input.value)}
        onChange={input.onChange}
        onInputChange={(text) => handleInputChange(text, input)}
        value={input.value || ''}
        {...rest}
      />
      {error && <FormText key="error" color="danger" className="ml-1">{error}</FormText>}
    </FormGroup>
  );
};

SelectField.propTypes = {
  disabled: PropTypes.bool,
  formGroupClassName: PropTypes.string,
  formGroupStyle: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  hasBorder: PropTypes.bool,
  input: PropTypes.shape({}).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  meta: PropTypes.shape({}).isRequired,
  multi: PropTypes.bool,
  onInputChange: PropTypes.func,
};

SelectField.defaultProps = {
  disabled: false,
  formGroupClassName: null,
  formGroupStyle: {},
  hasBorder: false,
  label: '',
  multi: false,
  onInputChange: noop,
};

export default SelectField;
