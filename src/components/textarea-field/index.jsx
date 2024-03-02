import React from 'react';
import classNames from 'classnames';
import { Badge, FormText, Label } from 'reactstrap';
import { useField, useFormContext } from 'components/index';

export default function TextareaField(props) {
  const { groupClassName = '', name, label, description, parse, validator, pbjName, required, maxCharsConfig = false, ...rest } = props;
  const formContext = useFormContext();
  const { editMode } = formContext;
  const { input, meta } = useField({ ...props }, formContext);

  const maxCharsConfigFin = maxCharsConfig && {
    ...{
      charsMax: 500,
      charsWarning: 300,
      styleInfo: 'info',
      styleDanger: 'danger',
      styleWarning: 'warning',
    },
    ...maxCharsConfig,
  };

  let maxCharsStyle = maxCharsConfigFin.styleInfo;
  if (input.value.length >= maxCharsConfigFin.charsMax) {
    maxCharsStyle = maxCharsConfigFin.styleDanger;
  } else if (input.value.length >= maxCharsConfigFin.charsWarning) {
    maxCharsStyle = maxCharsConfigFin.styleWarning;
  }

  const rootClassName = classNames(
    groupClassName,
    'form-group',
  );

  const className = classNames(
    'form-control',
    meta.touched && !meta.valid && 'is-invalid',
    meta.touched && meta.valid && 'is-valid',
  );

  return (
    <div className={rootClassName} id={`form-group-${pbjName || name}`}>
      {label && <Label htmlFor={name}>{label}{required && <Badge className="ms-1" color="light" pill>required</Badge>}</Label>}
      <textarea
        id={name}
        name={name}
        className={className}
        readOnly={!editMode}
        required={required}
        {...input}
        {...rest}
      />
      {description && <FormText color="dark">{description}</FormText>}
      {maxCharsConfigFin && (
        <FormText color={maxCharsStyle} className="ml-1">
          {maxCharsConfigFin.charsMax - input.value.length} characters remaining.
        </FormText>
      )}
      {meta.touched && !meta.valid && <FormText color="danger">{meta.error}</FormText>}
    </div>
  );
}
