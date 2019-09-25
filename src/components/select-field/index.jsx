import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormText, Label, Select } from '@triniti/admin-ui-plugin/components';

const SelectField = ({
  input,
  label,
  disabled,
  hasBorder,
  meta: { error },
  multi,
  ...rest
}) => {
  const arrowRenderer = rest.creatable ? () => null : undefined;
  const borderClass = hasBorder ? 'has-border' : null;

  return (
    <FormGroup className={borderClass}>
      {label && <Label for={input.name}>{label}</Label>}
      <Select
        arrowRenderer={arrowRenderer}
        multi={multi}
        name={input.name}
        value={input.value || ''}
        onChange={input.onChange}
        onBlur={() => input.onBlur(input.value)}
        disabled={disabled}
        classNamePrefix="Select"
        styles={{
          menuList: (base) => ({
            maxHeight: 'unset',
          }),
        }}
        {...rest}
      />
      {error && <FormText key="error" color="danger" className="ml-1">{error}</FormText>}
    </FormGroup>
  );
};

SelectField.propTypes = {
  disabled: PropTypes.bool,
  hasBorder: PropTypes.bool,
  input: PropTypes.shape({}).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  meta: PropTypes.shape({}).isRequired,
  multi: PropTypes.bool,
};

SelectField.defaultProps = {
  disabled: false,
  hasBorder: false,
  label: '',
  multi: false,
};

export default SelectField;
