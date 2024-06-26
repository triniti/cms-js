import React, { useState } from 'react';
import startCase from 'lodash-es/startCase.js';
import { Button, Card, CardBody, CardHeader, Input, Label } from 'reactstrap';
import { NumberField, TimePickerField } from '@triniti/cms/components/index.js';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const abbreviate = day => day.substr(0, 3);

const areAnyChecked = (values) => {
  return days.some((day) => {
      const d = abbreviate(day);
      return values[day] || (values[`${d}_start_at`] && values[`${d}_end_at`]);
  });
};

const hasValue = (values, day) => {
  const d = abbreviate(day);
  return !!(values[`${d}_start_at`] && values[`${d}_end_at`]);
};

export default function ScheduleTab(props) {
  const { editMode, form, formState } = props;
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
    if (areAnyChecked(formState.values)) {
      days.forEach((day) => {
        const d = abbreviate(day);
        if (formState.values[day] || (formState.values[`${d}_start_at`] && formState.values[`${d}_end_at`])) {
          form.change(`${d}_start_at`, startAt);
          form.change(`${d}_end_at`, endAt);
        }
      });
    } else {
      days.forEach((day) => {
        const d = abbreviate(day);
        form.change(`${d}_start_at`, startAt);
        form.change(`${d}_end_at`, endAt);
      });
    }
  };

  const handleChangeCheckbox = (checkBox, day) => {
    const d = abbreviate(day);
    if (!checkBox.checked) {
      form.change(`${d}_start_at`, null);
      form.change(`${d}_end_at`, null);
    } else {
      form.change(`${d}_start_at`, startAt);
      form.change(`${d}_end_at`, endAt);
    }
  };

  return (
    <Card>
      <CardHeader>Schedule</CardHeader>
      <CardBody>
        <div className="form-inline mb-5">
          <Label className="my-1 me-2">Range</Label>
          <Input
            className="w-auto flex-shrink-0"
            type="time"
            step="1"
            value={startAt}
            onChange={e => handleChangeTime(e.target.value, 'start')}
            disabled={!editMode}
          />
          <Label className="ms-2 me-2 mb-0">to</Label>
          <Input
            className="w-auto flex-shrink-0 me-2"
            type="time"
            step="1"
            value={endAt}
            onChange={e => handleChangeTime(e.target.value, 'end')}
            disabled={!editMode}
          />
          <Button
            className="mb-0"
            onClick={handleApply}
            color="secondary"
            outline
            disabled={!editMode}
          >
            {`Apply to ${areAnyChecked(formState.values) ? 'Checked' : 'All'}`}
          </Button>
        </div>

        {days.map((day) => (
          <div id={`${day}-schedule`} key={day} className="form-inline mb-4">
            <Input
              type="checkbox"
              id={day}
              name={day}
              onChange={(e) => handleChangeCheckbox(e.target, day)}
              checked={hasValue(formState.values, day)}
              className="me-0 mb-0 mr-2"
              disabled={!editMode}
            />
            <Label htmlFor={day} className="mb-0" style={{ justifyContent: 'left', minWidth: '5.3rem', marginLeft: '5px' }}>{startCase(day)}</Label>
            <TimePickerField groupClassName="mb-0" name={`${abbreviate(day)}_start_at`} />
            <Label className="ms-2 me-2 mb-0">to</Label>
            <TimePickerField groupClassName="mb-0" name={`${abbreviate(day)}_end_at`} />
          </div>
        ))}

        <NumberField name="priority" label="priority" description="A higher number takes priority over other promotions that match the same schedule and screen/slot." />
      </CardBody>
    </Card>
  );
}
