import React from 'react';
import { FormText, UncontrolledTooltip } from 'reactstrap';
import classNames from 'classnames';
import { Icon, useField, useFormContext } from 'components/index';

export default function SwitchField(props) {
  const {
    id,
    name,
    label,
    description,
    pbjName,
    labelOff = 'No',
    labelOn = 'Yes',
    inline,
    right,
    size,
    title,
    readOnly = false,
    tooltip,
    tooltipIconProps = {},
    ...rest
  } = props;
  const formContext = useFormContext();
  const { editMode } = formContext;
  const { input } = useField({ ...props, type: 'checkbox' }, formContext);

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
    <div id={`form-group-${domId}`} className={groupClassName}>
      {title && <label className="custom-control-header">{title}</label>}
      <div className={customClassName}>
        <input
          id={domId}
          name={name}
          className="custom-control-input"
          disabled={!editMode || readOnly}
          type="checkbox"
          {...input}
          {...rest}
        />
        <label className="switch-input-label" htmlFor={domId}>
          {labelOff && <span>{labelOff}</span>}
          {labelOn && <span>{labelOn}</span>}
        </label>
        <label className="text-label" htmlFor={domId}>{label}</label>
        {description && <FormText color="dark" style={{ flexBasis: '100%' }}>{description}</FormText>}
      </div>
      {tooltip && <>
        <Icon imgSrc="info-outline" id={`${name}-tooltip`} className="ms-1 align-self-start mb-2" {...tooltipIconProps} />
        <UncontrolledTooltip target={`${name}-tooltip`} placement="right" className="mb-2">{tooltip}</UncontrolledTooltip>
      </>}
    </div>
  );
}
