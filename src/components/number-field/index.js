import React from 'react';
import classNames from 'classnames';
import { Badge, FormText, InputGroup, InputGroupText, Label } from 'reactstrap';
import { Icon, useField, useFormContext } from '@triniti/cms/components/index.js';

export default function NumberField(props) {
  const { name, label, description, validator, nestedPbj, pbjName, required, groupClassName = '', ...rest } = props;
  const formContext = useFormContext();
  const { editMode } = formContext;
  const { input, meta } = useField({ ...props, withPbjParse: true }, formContext);

  const rootClassName = classNames(groupClassName, 'form-group');
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
          <Icon imgSrc="number-sign" size="sd" />
        </InputGroupText>
        <input
          id={name}
          name={name}
          className={className}
          readOnly={!editMode}
          type="number"
          {...input}
          {...rest}
        />
      </InputGroup>
      {description && <FormText color="dark">{description}</FormText>}
      {meta.touched && !meta.valid && <FormText color="danger">{meta.error}</FormText>}
    </div>
  );
}
