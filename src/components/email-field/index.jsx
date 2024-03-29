import React from 'react';
import classNames from 'classnames';
import { Badge, FormText, InputGroup, InputGroupText, Label } from 'reactstrap';
import { Icon, useField, useFormContext } from 'components/index';

export default function EmailField(props) {
  const { groupClassName = '', name, label, description, validator, pbjName, required, ...rest } = props;
  const formContext = useFormContext();
  const { editMode } = formContext;
  const { input, meta } = useField({ ...props }, formContext);

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
      <InputGroup>
        <InputGroupText className="px-2 text-black-50">
          <Icon imgSrc="mail" size="sd" />
        </InputGroupText>
        <input
          id={name}
          name={name}
          className={className}
          readOnly={!editMode}
          type="email"
          required={required}
          {...input}
          {...rest}
        />
      </InputGroup>
      {description && <FormText color="dark">{description}</FormText>}
      {meta.touched && !meta.valid && <FormText color="danger">{meta.error}</FormText>}
    </div>
  );
}
