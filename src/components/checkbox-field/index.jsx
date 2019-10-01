import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, FormGroup, Label } from '@triniti/admin-ui-plugin/components';

const CheckboxField = ({ input, label, ...rest }) => (
  <FormGroup check className="mr-4">
    <Checkbox size="sd" id={input.name} {...input} checked={input.value === true} {...rest}>
      <Label>{ label }</Label>
    </Checkbox>
  </FormGroup>
);

CheckboxField.propTypes = {
  disabled: PropTypes.bool,
  input: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

CheckboxField.defaultProps = {
  disabled: false,
  label: '',
};

export default CheckboxField;
