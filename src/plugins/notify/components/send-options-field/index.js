import React, { useState } from 'react';
import ReactSelect from 'react-select';
import classNames from 'classnames';
import { Badge, Label } from 'reactstrap';
import { DatePickerField, useField, useFormContext } from 'components';

const sendOptions = [
  { label: 'Send Now', value: 'send-now' },
  { label: 'Schedule Send', value: 'schedule-send' },
  { label: 'Send on Publish', value: 'send-on-publish' },
];

export default function SendOptionsField(props) {
  const {
    groupClassName = '',
    name,
    label,
    description,
    pbjName,
    options = [],
    allowOther = false,
    ignoreUnknownOptions = false,
    readOnly = false,
    required = false,
    articleStatus,
    ...rest
  } = props;

  const formContext = useFormContext();
  const { input, meta } = useField({ ...props }, formContext);
  const [selectedOption, setSelectedOption] = useState(null);

  const className = classNames(
    'select',
    meta.touched && !meta.valid && 'is-invalid',
    meta.touched && meta.valid && 'is-valid',
  );

  let currentOption;
  if ('schedule-send' === selectedOption) {
    currentOption = { label: 'Schedule Send', value: 'schedule-send' };
  } else {
    currentOption = `${input.value}`.length ? sendOptions.find(o => `${o.value}` === `${input.value}`) : null;
  }

  const renderSelected = (selected) => {
    setSelectedOption(selected.value);
    return selected.value;
  }

  const rootClassName = classNames(
    groupClassName,
    'form-group',
  );

  return (
    <>
      <div className={rootClassName} id={`form-group-${pbjName || name}`}>
        {label && <Label htmlFor={name}>{label}{required && <Badge className="ms-1" color="light" pill>required</Badge>}</Label>}
        <ReactSelect
          {...input}
          {...rest}
          id={name}
          name={name}
          className={className}
          classNamePrefix="select"
          options={articleStatus === 'published' ?
            sendOptions.filter(option => option.value !== 'send-on-publish')
            : sendOptions}
          value={currentOption}
          onChange={selected => input.onChange(selected ? renderSelected(selected) : undefined)}
        />
      </div>
      {selectedOption === 'schedule-send' && (
        <DatePickerField name="send_at" label="Send At" required />
      )}
    </>
  );
}
