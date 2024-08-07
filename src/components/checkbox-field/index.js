import React from 'react';
import classNames from 'classnames';
import { Label } from 'reactstrap';
import { useField, useFormContext } from '@triniti/cms/components/index.js';

export default function CheckboxField(props) {
  const {
    className = '',
    id,
    name,
    label,
    nestedPbj,
    pbjName,
    inline,
    button,
    right,
    size,
    readOnly = false,
    ...rest
  } = props;
  const formContext = useFormContext();
  const { editMode } = formContext;
  const { input } = useField({ ...props, type: 'checkbox' }, formContext);

  const groupClassName = classNames(
    className,
    'form-check',
    {
      'form-check-inline': inline,
      'form-check--button': button,
      'form-check-right': right,
      [`form-check-${size}`]: !!size,
    },
  );

  const domId = (id || name || pbjName).replace(/(\[|\])/g, '-');

  return (
    <div id={`form-group-${domId}`} className={groupClassName}>
      <input
        id={domId}
        name={name}
        className="form-check-input"
        disabled={!editMode || readOnly}
        type="checkbox"
        {...input}
        {...rest}
      />
      <Label className="form-check-label" htmlFor={domId}>{label}</Label>
    </div>
  );
}
