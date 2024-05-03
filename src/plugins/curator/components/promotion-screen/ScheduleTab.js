import React, { useState } from 'react';
import startCase from 'lodash-es/startCase';
import { Button, Card, CardBody, CardHeader, Input, Label } from 'reactstrap';
import { CheckboxField, NumberField, TimePickerField } from 'components';

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const abbreviate = day => day.substr(0, 3);
const areAnyChecked = (formValues) =>
  days.some((day) => formValues[day] ||
    (formValues[`${abbreviate(day)}_start_at`] && formValues[`${abbreviate(day)}_end_at`]));
const hasValue = (formValues, day) =>
  !!(formValues[`${abbreviate(day)}_start_at`] && formValues[`${abbreviate(day)}_end_at`]);

export default function ScheduleTab(props) {
  const { form, formState } = props;
  const formValues = formState.values;

  const [startAt, setStartAt] = useState('00:00:00');
  const [endAt, setEndAt] = useState('23:59:59');

  const handleChangeTime = (time, type) => {
    const validValue = time.length === 5 ? `${time}:00` : time;
    const newStart = type === 'start' ? validValue : startAt;
    const newEnd = type === 'end' ? validValue : endAt;

    setStartAt(newStart);
    setEndAt(newEnd);
  };

  const handleApply = () => {
    if (areAnyChecked(formValues)) {
      days.forEach((day) => {
        if (formValues[day] ||
          (formValues[`${abbreviate(day)}_start_at`] && formValues[`${abbreviate(day)}_end_at`])
        ) {
          form.change(`${abbreviate(day)}_start_at`, startAt);
          form.change(`${abbreviate(day)}_end_at`, endAt);
        }
      });
    } else {
      days.forEach((day) => {
        form.change(`${abbreviate(day)}_start_at`, startAt);
        form.change(`${abbreviate(day)}_end_at`, endAt);
        form.change(day, true);
      });
    }
  };

  const handleChangeCheckbox = (checkBox, day) => {
    const isChecked = checkBox.checked;
    if (!isChecked) {
      form.change(`${abbreviate(day)}_start_at`, null);
      form.change(`${abbreviate(day)}_end_at`, null);
      form.change(day, false);
    } else {
      form.change(`${abbreviate(day)}_start_at`, startAt);
      form.change(`${abbreviate(day)}_end_at`, endAt);
      form.change(day, true);
    }
  };

  return (
    <Card>
      <CardHeader>Schedule</CardHeader>
      <CardBody>
        <div className="form-inline mb-5">
          <Label className="my-1 me-2">range</Label>
          <Input
            className="w-auto flex-shrink-0"
            type="time"
            bsSize="sm"
            step="1"
            value={startAt}
            onChange={e => handleChangeTime(e.target.value, 'start')}
          />
          <Label className="ms-2 me-2 mb-0">to</Label>
          <Input
            className="w-auto flex-shrink-0 me-2"
            type="time"
            bsSize="sm"
            step="1"
            value={endAt}
            onChange={e => handleChangeTime(e.target.value, 'end')}
          />
          <Button
            className="mb-0"
            onClick={handleApply}
            color="light"
            size="sm"
          >
            {`apply to ${areAnyChecked(formValues) ? 'checked' : 'all'}`}
          </Button>
        </div>

        {days.map((day) => (
          <div id={`${day}-schedule`} key={day} className="form-inline mb-4">
            <CheckboxField
              name={day}
              inline
              onChange={(e) => handleChangeCheckbox(e.target, day)}
              checked={hasValue(formValues, day)}
              className="me-0 mb-0"
            />
            <Label className="mb-0" style={{ justifyContent: 'left', minWidth: '5.3rem' }}>{ startCase(day) }</Label>
            <TimePickerField className="form-control-sm" groupClassName="mb-0" name={`${abbreviate(day)}_start_at`} />
            <Label className="ms-2 me-2 mb-0">to</Label>
            <TimePickerField className="form-control-sm" groupClassName="mb-0" name={`${abbreviate(day)}_end_at`} />
          </div>
        ))}

        <NumberField name="priority" label="priority" />
      </CardBody>
    </Card>
  );
}
