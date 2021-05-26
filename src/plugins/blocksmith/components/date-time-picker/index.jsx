import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import {
  DatePicker,
  FormGroup,
  Icon,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
} from '@triniti/admin-ui-plugin/components';

const DateTimePicker = ({
  updatedDate,
  onChangeDate: handleChangeDate,
  onChangeTime: handleChangeTime,
  shouldCloseOnSelect,
  inline,
  label,
  ...rest
}) => (
  <FormGroup>
    <Label>
      {label}: {moment(updatedDate).format('YYYY-MM-DD hh:mm A')}
    </Label>
    <FormGroup className="mb-3 mt-1 shadow-none">
      <DatePicker
        onChange={handleChangeDate}
        selected={updatedDate}
        shouldCloseOnSelect={shouldCloseOnSelect}
        inline={inline}
        {...rest}
      />
      <InputGroup style={{ width: '15rem', margin: 'auto' }}>
        <InputGroupAddon addonType="prepend" className="text-dark">
          <InputGroupText>
            <Icon imgSrc="clock-outline" />
          </InputGroupText>
        </InputGroupAddon>
        <Input
          type="time"
          onChange={handleChangeTime}
          defaultValue={moment(updatedDate).format('HH:mm')}
        />
      </InputGroup>
    </FormGroup>
  </FormGroup>
);

DateTimePicker.propTypes = {
  onChangeDate: PropTypes.func.isRequired,
  onChangeTime: PropTypes.func.isRequired,
  updatedDate: PropTypes.instanceOf(Date).isRequired,
  shouldCloseOnSelect: PropTypes.bool,
  inline: PropTypes.bool,
  label: PropTypes.string,
};

DateTimePicker.defaultProps = {
  shouldCloseOnSelect: false,
  inline: true,
  label: 'Updated Time',
};

export default DateTimePicker;
