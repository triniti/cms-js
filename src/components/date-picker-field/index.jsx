import camelCase from 'lodash/camelCase';
import inflection from 'inflection';
import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Button,
  FormGroup,
  FormText,
  Label,
  DatePicker,
  Icon,
  Input,
  DropdownToggle,
  InputGroup,
  DropdownMenu,
  InputGroupButtonDropdown,
  DropdownItem,
} from '@triniti/admin-ui-plugin/components';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';

import delegate from './delegate';
import './styles.scss';

const COMPLETE_DATE_REGEX = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
const DATE_REGEX = /^((0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/\d{0,4}|(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/|(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])|(0[1-9]|1[012])\/[1-3]|(0[1-9]|1[012])\/|(0[1-9]|1[012])\/|(0[1-9]|1[012])|\d)$/;
const MOMENT_DATE_FORMAT = 'MM/DD/YYYY';

class DatePickerField extends React.Component {
  static propTypes = {
    input: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    label: PropTypes.string,
    onTouch: PropTypes.func.isRequired,
    placeholderText: PropTypes.string,
    readOnly: PropTypes.bool,
    showQuickSelect: PropTypes.bool,
    showSetCurrentDateTimeIcon: PropTypes.bool,
    showTime: PropTypes.bool,
    size: PropTypes.string,
    meta: PropTypes.shape({
      error: PropTypes.string,
    }).isRequired,
    quickSelectOptions: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      number: PropTypes.number,
      unit: PropTypes.string,
    })),
  };

  static defaultProps = {
    label: null,
    showSetCurrentDateTimeIcon: true,
    showTime: true,
    showQuickSelect: false,
    size: null,
    readOnly: false,
    placeholderText: MOMENT_DATE_FORMAT,
    quickSelectOptions: [
      {
        amount: 1,
        unit: 'year',
      },
      {
        amount: 1,
        unit: 'month',
      },
      {
        amount: 1,
        unit: 'week',
      },
    ],
  };

  constructor(props) {
    super(props);

    this.state = {
      isQuickSelectOpen: false,
    };

    this.handleBlur = this.handleBlur.bind(this);
    this.handleChangeDateRaw = this.handleChangeDateRaw.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleClearDate = this.handleClearDate.bind(this);
    this.handleQuickSelect = this.handleQuickSelect.bind(this);
    this.handleSetCurrentDateTime = this.handleSetCurrentDateTime.bind(this);
    this.handleToggleQuickSelect = this.handleToggleQuickSelect.bind(this);
  }

  handleChangeDateRaw(e) {
    const { target: { value: date } } = e;
    const { input: { onChange } } = this.props;

    if (COMPLETE_DATE_REGEX.test(date)) {
      onChange(moment(date, MOMENT_DATE_FORMAT, true).toDate());
      return;
    }

    e.preventDefault(); // prevent handleChangeDate/onChange from firing after this

    if (/^[0-9]\/$/.test(date)) {
      // eg '2/' -> '02/'
      onChange(`0${date}`);
    } else if (/^0?[0-9]\/[0-9]\/$/.test(date)) {
      // eg '2/2/' -> '02/02'
      onChange(`${date.substring(0, 3)}0${date.substring(3, date.length)}`);
    } else {
      onChange(date);
    }
  }

  handleSetCurrentDateTime() {
    const { input: { onChange } } = this.props;
    onChange(moment().toDate());
  }

  handleChangeTime({ currentTarget: { value: time } }) {
    const { input: { onChange, value } } = this.props;
    const changedTime = value ? moment(value) : moment();

    changedTime
      .set('hours', time ? time.split(':')[0] : 0)
      .set('minutes', time ? time.split(':')[1] : 0);

    onChange(changedTime.toDate());
  }

  /**
   * If an incomplete date is entered, this clears it out on blur
   *
   * @param {SyntheticEvent} event - a synthetic event
   */
  handleBlur(event) {
    if (!event || event.type !== 'blur') {
      return;
    }

    // cant figure out another way to solve this (╯°□°）╯︵ ┻━┻
    // here's the scenario:
    // 1. go to a carousel widget screen's searchRequest fields
    // 2. enter today's date as the createdAfter field
    // 3. enter yesterday's date as the createdBefore field
    // 4. you (correctly) get an error
    // 5. enter tomorrow's date as the createdBefore field
    // 6. the date changes and the error goes away. lovely.
    // 7. now do all that but with this logic outside of the setTimeout. the blur
    //    will fire immediately after the first (correct) CHANGE action, and overwrite
    //    it with the current (now stale) value.
    // 8. cry about it. or fix it.
    setTimeout(() => {
      const {
        onTouch,
        input: { name, onChange, value },
        meta: { form, touched },
      } = this.props;

      if (value === '') {
        return;
      }

      const newDate = moment(value, MOMENT_DATE_FORMAT, true);
      if (newDate.isValid()) {
        onChange(newDate.toDate());
        if (!touched) {
          onTouch(form, name);
        }
      } else {
        onChange(null);
      }
    }, 0);
  }

  handleClearDate() {
    const { input: { onChange } } = this.props;
    onChange(null);
  }

  handleQuickSelect(number, unit) {
    const { input: { onChange } } = this.props;
    onChange(moment().add(number, inflection.pluralize(unit)).toDate());
  }

  handleToggleQuickSelect() {
    this.setState(({ isQuickSelectOpen }) => ({ isQuickSelectOpen: !isQuickSelectOpen }));
  }

  render() {
    const {
      input: { name, onChange, value },
      label,
      meta: { error },
      placeholderText,
      quickSelectOptions,
      readOnly,
      showQuickSelect,
      showSetCurrentDateTimeIcon,
      showTime,
      size,
    } = this.props;
    const { isQuickSelectOpen } = this.state;
    const dateSelected = typeof value === 'string' ? null : moment(value, MOMENT_DATE_FORMAT, true);
    let dateValue = value;
    if (typeof dateValue === 'string') {
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(dateValue)) {
        // ex 2019-06-11T07:00:52.887Z
        dateValue = moment(value).format(MOMENT_DATE_FORMAT);
      }
    } else {
      dateValue = moment(value, MOMENT_DATE_FORMAT, true).format(MOMENT_DATE_FORMAT);
    }
    return (
      <FormGroup>
        {
          label
          && (
            <FormGroup className="mb-0">
              <Label>{label}</Label>
            </FormGroup>
          )
        }
        <div className="d-inline-flex">
          <div className="mr-1">
            {
              !showQuickSelect
              && (
                <DatePicker
                  disabled={readOnly}
                  onBlur={this.handleBlur}
                  onChange={onChange}
                  onChangeRaw={this.handleChangeDateRaw}
                  placeholderText={placeholderText}
                  selected={dateSelected && dateSelected.isValid() ? dateSelected.toDate() : null}
                  size={size}
                  value={dateValue !== 'Invalid date' ? dateValue : ''}
                  popperModifiers={{
                    offset: {
                      enabled: true,
                      offset: '0 10px',
                    },
                  }}
                />
              )
            }
            {
              showQuickSelect
              && (
                <InputGroup>
                  <InputGroupButtonDropdown
                    addonType="prepend"
                    isOpen={isQuickSelectOpen}
                    toggle={this.handleToggleQuickSelect}
                  >
                    <DropdownToggle split outline color="light" />
                    <DropdownMenu>
                      {
                        quickSelectOptions.map(({
                          amount,
                          unit,
                        }) => (
                          <DropdownItem
                            key={amount}
                            onClick={() => this.handleQuickSelect(amount, unit)}
                          >
                            {`${amount} ${amount > 1 ? inflection.pluralize(unit) : unit} from now`}
                          </DropdownItem>
                        ))
                      }
                    </DropdownMenu>
                  </InputGroupButtonDropdown>
                  <DatePicker
                    disabled={readOnly}
                    onBlur={this.handleBlur}
                    onChange={onChange}
                    onChangeRaw={this.handleChangeDateRaw}
                    placeholderText={placeholderText}
                    selected={dateSelected && dateSelected.isValid() ? dateSelected.toDate() : null}
                    size={size}
                    value={dateValue !== 'Invalid date' ? dateValue : ''}
                    popperModifiers={{
                      offset: {
                        enabled: true,
                        offset: '0 10px',
                      },
                    }}
                  />
                </InputGroup>
              )
            }
          </div>
          {
            showTime
            && (
              <InputGroup className="mr-3" style={{ width: '10.5em' }}>
                <Input
                  disabled={readOnly}
                  onChange={this.handleChangeTime}
                  size={size}
                  type="time"
                  value={value ? moment(value).format('HH:mm') : ''}
                />
              </InputGroup>
            )
          }
          {
            showTime && showSetCurrentDateTimeIcon
            && (
              <Button
                color="hover"
                disabled={readOnly}
                id={`set-current-time-icon-${camelCase(name)}`}
                onClick={this.handleSetCurrentDateTime}
                radius="circle"
                size={size}
                style={{ marginTop: 'auto', marginBottom: 'auto' }}
              >
                <Icon imgSrc="alarm" />
                <UncontrolledTooltip target={`set-current-time-icon-${camelCase(name)}`}>
                  Set current time & date
                </UncontrolledTooltip>
              </Button>
            )
          }
          <Button
            color="hover"
            disabled={readOnly}
            id={`clear-time-icon-${camelCase(name)}`}
            onClick={this.handleClearDate}
            radius="circle"
            size={size}
            style={{ marginTop: 'auto', marginBottom: 'auto' }}
          >
            <Icon imgSrc="delete" />
            <UncontrolledTooltip target={`clear-time-icon-${camelCase(name)}`}>
              Clear date
            </UncontrolledTooltip>
          </Button>
        </div>
        {
          error
          && <FormText color="danger" className="ml-1">{error}</FormText>
        }
      </FormGroup>
    );
  }
}
export default connect(null, delegate)(DatePickerField);
export const DATE_FORMAT = MOMENT_DATE_FORMAT;
