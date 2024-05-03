import React from 'react';
import DatePicker from 'react-datepicker';
import classNames from 'classnames';
import { Badge, FormText, InputGroup, InputGroupText, Label } from 'reactstrap';
import formatDate from '@triniti/cms/utils/formatDate.js';
import { Icon, useField, useFormContext } from '@triniti/cms/components/index.js';

// fixme: handle date vs date-time scenarios
export default function DatePickerField(props) {
  const {
    groupClassName = '',
    name,
    label,
    description,
    pbjName,
    isClearable = true,
    readOnly = false,
    required = false,
    showTimeSelect = true,
    dateFormat = 'MM/dd/yyyy h:mm a',
  } = props;
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

  const currentDate = input.value ? new Date(input.value) : null;

  return (
    <div className={rootClassName} id={`form-group-${pbjName || name}`}>
      {label && <Label htmlFor={name}>{label}{required && <Badge className="ms-1" color="light" pill>required</Badge>}</Label>}
      <InputGroup>
        <InputGroupText className="px-2 text-black-50">
          <Icon imgSrc="calendar" size="sd" />
        </InputGroupText>
        {editMode && !readOnly && (
          <DatePicker
            id={name}
            name={name}
            className={className}
            readOnly={!editMode}
            selected={currentDate}
            isClearable={isClearable}
            showTimeSelect={showTimeSelect}
            timeFormat="h:mm a"
            timeCaption="Time"
            dateFormat={dateFormat}
            {...input}
            value={currentDate}
            onChange={date => {
              input.onChange(date ? date.toISOString() : undefined);
              input.onBlur();
            }}
          />
        )}
        {(!editMode || readOnly) && (
          <input type="text" className="form-control" readOnly value={currentDate ? formatDate(currentDate) : ''} />
        )}
      </InputGroup>
      {description && <FormText color="dark">{description}</FormText>}
      {meta.touched && !meta.valid && <FormText color="danger">{meta.error}</FormText>}
    </div>
  );
}
