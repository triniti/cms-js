import React from 'react';
import classNames from 'classnames';
import { Badge, FormText, Label } from 'reactstrap';
import { useField, useFormContext } from '@triniti/cms/components/index.js';

export default function TextField(props) {
  const {
    name,
    label,
    description,
    parse,
    format,
    validator,
    Warning,
    nestedPbj,
    pbjName,
    required,
    className = '',
    groupClassName = '',
    ...rest
  } = props;
  const formContext = useFormContext();
  const { editMode } = formContext;
  const { input, meta } = useField({ ...props }, formContext);

  const rootClassName = classNames(groupClassName, 'form-group');
  const classes = classNames(
    'form-control',
    className,
    meta.touched && !meta.valid && 'is-invalid',
    meta.touched && meta.valid && 'is-valid',
  );

  return (
    <div className={rootClassName} id={`form-group-${pbjName || name}`}>
      {label && <Label htmlFor={name}>{label}{required && <Badge className="ms-1" color="light" pill>required</Badge>}</Label>}
      <input
        id={name}
        name={name}
        className={classes}
        readOnly={!editMode}
        required={required}
        {...input}
        {...rest}
      />
      {description && <FormText color="dark">{description}</FormText>}
      {meta.touched && !meta.valid && <FormText color="danger">{meta.error}</FormText>}
      {editMode && Warning && <Warning value={input.value} />}
    </div>
  );
}
