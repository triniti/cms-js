import React from 'react';
import { FormText } from 'reactstrap';
import classNames from 'classnames';

export default function Switch(props) {
  const {
    description,
    editMode,
    id,
    inline,
    label,
    labelOff = 'No',
    labelOn = 'Yes',
    name,
    pbjName,
    readOnly = false,
    right,
    size,
    title,
    ...rest
  } = props;

  const groupClassName = classNames(
    'form-group',
    {
      'form-group-inline': inline,
    },
  );

  const customClassName = classNames(
    'custom-control',
    'custom-control-switch',
    {
      'custom-control-right': right,
      [`custom-control-${size}`]: !!size,
    },
  );

  const domId = (id || name || pbjName).replace(/(\[|\])/g, '-');

  return (
    <div className={groupClassName}>
      {title && <label className="custom-control-header">{title}</label>}
      <div className={customClassName}>
        <input
          className="custom-control-input"
          disabled={!editMode || readOnly}
          id={domId}
          name={name}
          type="checkbox"
          {...rest}
        />
        <label className="switch-input-label" htmlFor={domId}>
          {labelOff && <span>{labelOff}</span>}
          {labelOn && <span>{labelOn}</span>}
        </label>
        <label className="text-label" htmlFor={domId}>{label}</label>
        {description && <FormText color="dark" style={{ flexBasis: '100%' }}>{description}</FormText>}
      </div>
    </div>
  );
}
