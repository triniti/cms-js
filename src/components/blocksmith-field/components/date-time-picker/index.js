import moment from 'moment';
import React from 'react';
import {
  // DatePicker,
  Input,
  InputGroup,
  InputGroupText,
  Label,
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import Icon from '@triniti/cms/components/icon/index.js';

// todo: style this mofo like admin-ui used to be
export default function DateTimePicker({
  updatedDate,
  onChangeDate: handleChangeDate,
  onChangeTime: handleChangeTime,
  shouldCloseOnSelect,
  inline,
  label,
  ...rest
}) {

  return (
    <div className="form-group">
      <Label>
        {label}: {moment(updatedDate).format('YYYY-MM-DD hh:mm A')}
      </Label>
      <div className="shadow-none">
        <DatePicker
          onChange={handleChangeDate}
          selected={updatedDate}
          shouldCloseOnSelect={shouldCloseOnSelect}
          inline
          {...rest}
        />
        <InputGroup style={{ width: '15rem', margin: 'auto' }}>
          <InputGroupText className="text-dark">
            <Icon imgSrc="clock-outline" />
          </InputGroupText>
          <Input
            type="time"
            onChange={handleChangeTime}
            defaultValue={moment(updatedDate).format('HH:mm')}
          />
        </InputGroup>
      </div>
    </div>
  )
};
