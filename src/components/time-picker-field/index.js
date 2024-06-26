import React from 'react';
import classNames from 'classnames';
import { Badge, FormText, Label } from 'reactstrap';
import { useField, useFormContext } from '@triniti/cms/components/index.js';

export default function TimePickerField(props) {
  const {
    name,
    label,
    description,
    nestedPbj,
    pbjName,
    required,
    groupClassName = '',
    ...rest
  } = props;
  const formContext = useFormContext();
  const { editMode } = formContext;
  const { input, meta } = useField({ ...props }, formContext);

  const rootClassName = classNames(groupClassName, 'form-group');
  const className = classNames(
    'form-control',
    meta.touched && !meta.valid && 'is-invalid',
    meta.touched && meta.valid && 'is-valid',
  );

  return (
    <div className={rootClassName} id={`form-group-${pbjName || name}`}>
      {label && <Label htmlFor={name}>{label}{required && <Badge className="ms-1" color="light" pill>required</Badge>}</Label>}
      <input
        id={name}
        name={name}
        className={className}
        readOnly={!editMode}
        required={required}
        type="time"
        step="1"
        {...input}
        {...rest}
      />
      {description && <FormText color="dark">{description}</FormText>}
      {meta.touched && !meta.valid && <FormText color="danger">{meta.error}</FormText>}
    </div>
  );
}
