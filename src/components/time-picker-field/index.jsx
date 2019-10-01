import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  FormGroup,
  FormText,
  Input,
  InputGroup,
  Label,
} from '@triniti/admin-ui-plugin/components';

const TimePickerField = ({
  areSecondsAllowed,
  className,
  input,
  label,
  meta: { touched, error },
  ...attributes
}) => (
  <FormGroup className={className}>
    {
      label
      && <Label for={input.name}>{ label }</Label>
    }
    <InputGroup>
      <Input
        step={areSecondsAllowed ? 1 : 60}
        type="time"
        {...input}
        {...attributes}
      />
    </InputGroup>
    {
      touched && error
      && <FormText key="error" color="danger" className="ml-1">{ error }</FormText>
    }
  </FormGroup>
);

TimePickerField.propTypes = {
  areSecondsAllowed: PropTypes.bool,
  className: PropTypes.string,
  input: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(moment)]),
    onChange: PropTypes.func,
  }).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  meta: PropTypes.shape({}).isRequired,
};

TimePickerField.defaultProps = {
  areSecondsAllowed: false,
  className: '',
  label: null,
};

export default TimePickerField;
