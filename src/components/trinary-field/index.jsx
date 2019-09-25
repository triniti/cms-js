import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormGroup, Label, TrinaryControl } from '@triniti/admin-ui-plugin/components';

const TrinaryField = ({
  input, label, trueText, falseText, disabled, hasBorder, readOnly, unsetText,
}) => (
  <FormGroup className={classNames({ 'has-border': hasBorder })}>
    <Label>{label}</Label>
    <TrinaryControl
      {...input}
      name={input.name}
      width="120px"
      unsetText={unsetText}
      trueText={trueText}
      falseText={falseText}
      value={input.value || 0}
      disabled={disabled || readOnly}
    />
  </FormGroup>
);

TrinaryField.propTypes = {
  disabled: PropTypes.bool,
  falseText: PropTypes.string,
  hasBorder: PropTypes.bool,
  input: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  label: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  trueText: PropTypes.string,
  unsetText: PropTypes.string,
};

TrinaryField.defaultProps = {
  disabled: false,
  falseText: 'False',
  hasBorder: false,
  readOnly: false,
  trueText: 'True',
  unsetText: 'Any',
};

export default TrinaryField;
