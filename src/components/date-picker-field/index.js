import React from 'react';
import DatePicker from 'react-datepicker';
import classNames from 'classnames';
import { Badge, FormText, InputGroup, InputGroupText, Label } from 'reactstrap';
import formatDate from '@triniti/cms/utils/formatDate.js';
import { Icon, useField, useFormContext } from '@triniti/cms/components/index.js';

// fixme: handle date vs date-time scenarios
export default function DatePickerField(props) {
  const {
    name,
    label,
    description,
    nestedPbj,
    pbjName,
    groupClassName = '',
    isClearable = true,
    readOnly = false,
    required = false
  } = props;
  const formContext = useFormContext();
  const { editMode } = formContext;
  const { input, meta, pbjField } = useField({ ...props }, formContext);

  const rootClassName = classNames(groupClassName, 'form-group');
  const className = classNames(
    'form-control',
    meta.touched && !meta.valid && 'is-invalid',
    meta.touched && meta.valid && 'is-valid',
  );

  let currentDate;
  let dateOnly = false;

  if (pbjField && pbjField.getType().getTypeValue() === 'date') {
    dateOnly = true;
    const [year, month, day] = (input.value || '').split('-').map(Number);
    currentDate = input.value ? new Date(year, month - 1, day) : null;
  } else {
    currentDate = input.value ? new Date(input.value) : null;
  }

  const timeOptions = dateOnly
    ? {dateFormat: 'MM/dd/yyyy'}
    : {showTimeSelect: true, dateFormat: 'MM/dd/yyyy h:mm a', timeFormat : 'h:mm a', timeCaption: 'Time'};

  return (
    <div className={rootClassName} id={`form-group-${pbjName || name}`}>
      {label && <Label htmlFor={name}>{label}{required && <Badge className="ms-1" color="light" pill>required</Badge>}</Label>}
      <InputGroup>
        <InputGroupText className="px-2 text-black-50">
          <Icon imgSrc="calendar" size="sd" />
        </InputGroupText>
        {editMode && !readOnly && (
          <DatePicker.default
            id={name}
            name={name}
            className={className}
            readOnly={!editMode}
            selected={currentDate}
            isClearable={isClearable}
            {...timeOptions}
            {...input}
            value={currentDate}
            onChange={date => {
              const v = date ? (dateOnly ? date.toISOString().substring(0, 10) : date.toISOString()) : undefined;
              input.onChange(v);
              input.onBlur();
            }}
          />
        )}
        {(!editMode || readOnly) && (
          <input type="text" className="form-control" readOnly value={currentDate ? formatDate(currentDate, dateOnly ? 'MMM dd, yyyy' : undefined) : ''} />
        )}
      </InputGroup>
      {description && <FormText color="dark">{description}</FormText>}
      {meta.touched && !meta.valid && <FormText color="danger">{meta.error}</FormText>}
    </div>
  );
}
