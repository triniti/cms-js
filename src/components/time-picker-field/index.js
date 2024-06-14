import React from 'react';
import classNames from 'classnames';
import { Badge, FormText, Input, Label } from 'reactstrap';
import { useField, useFormContext } from '@triniti/cms/components/index.js';

export default function TimePickerField(props) {
  const {
    name,
    label,
    description,
    nestedPbj,
    pbjName,
    className = '',
    groupClassName = '',
    readOnly = false,
    required = false
  } = props;
  const formContext = useFormContext();
  const { editMode } = formContext;
  const { input, meta } = useField({ ...props }, formContext);

  const rootClassName = classNames(groupClassName, 'form-group');
  const inputClassName = classNames(
    className,
    'form-control',
    meta.touched && !meta.valid && 'is-invalid',
    meta.touched && meta.valid && 'is-valid',
  );

  const currentTime = input.value ? input.value : '';

  return (
    <div className={rootClassName} id={`form-group-${pbjName || name}`}>
      {label && <Label htmlFor={name}>{label}{required && <Badge className="ms-1" color="light" pill>required</Badge>}</Label>}
      {editMode && !readOnly && (
        <Input
          id={name}
          name={name}
          className={inputClassName}
          readOnly={!editMode}
          type="time"
          step="1"
          {...input}
          value={currentTime}
          onChange={time => {
            input.onChange(time ? time : undefined);
            input.onBlur();
          }}
        />
      )}
      {(!editMode || readOnly) && (
        <input type="text" className="form-control" readOnly value={currentTime} />
      )}
      {description && <FormText color="dark">{description}</FormText>}
      {meta.touched && !meta.valid && <FormText color="danger">{meta.error}</FormText>}
    </div>
  );
}
