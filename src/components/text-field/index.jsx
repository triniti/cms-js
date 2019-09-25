import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormGroup, FormText, Input, Label } from '@triniti/admin-ui-plugin/components';

const TextField = ({
  input,
  className,
  label,
  meta: { touched, error, warning },
  readOnly,
  hasBorder,
  inline,
  ...rest
}) => {
  const readOnlyField = readOnly ? 'readonly' : '';
  const groupStyle = inline ? {} : { display: 'flex', flexDirection: 'column' };
  const textStyle = inline ? {} : { alignSelf: 'start' };
  const textClassName = classNames({ 'ml-1': inline });

  return (
    <FormGroup className={classNames(className, { 'has-border': hasBorder })} style={groupStyle}>
      {
        label
        && <Label for={input.name}>{label}</Label>
      }
      <Input
        disabled={readOnly}
        id={input.name}
        invalid={touched && !!error}
        readOnly={readOnlyField}
        valid={touched && !error}
        {...input}
        {...rest}
      />
      {
        warning
        && <FormText style={textStyle} color="warning" className={textClassName}>{warning}</FormText>
      }
      {
        touched && error
        && <FormText style={textStyle} color="danger" className={textClassName}>{error}</FormText>
      }
    </FormGroup>
  );
};

TextField.propTypes = {
  inline: PropTypes.bool,
  input: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  className: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  meta: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  readOnly: PropTypes.bool,
  hasBorder: PropTypes.bool,
};

TextField.defaultProps = {
  className: '',
  inline: true,
  label: '',
  readOnly: false,
  hasBorder: false,
};

export default TextField;
