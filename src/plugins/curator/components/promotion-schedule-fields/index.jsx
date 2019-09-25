import PropTypes from 'prop-types';
import React from 'react';
import startCase from 'lodash/startCase';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import CheckboxField from '@triniti/cms/components/checkbox-field';
import NumberField from '@triniti/cms/components/number-field';
import TimePickerField from '@triniti/cms/components/time-picker-field';
import { Button, Card, CardBody, CardHeader, FormGroup, FormText, Input, InputGroup, Label } from '@triniti/admin-ui-plugin/components';
import delegateFactory from './delegate';
import selector from './selector';

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const abbrv = (day) => day.substr(0, 3);
const endAtName = (day) => `${abbrv(day)}EndAt`;
const startAtName = (day) => `${abbrv(day)}StartAt`;
const areAnyChecked = (formValues) => days.some((day) => formValues[day]);

class ScheduleFields extends React.Component {
  static propTypes = {
    delegate: PropTypes.shape({
      handleChange: PropTypes.func,
    }).isRequired,
    formValues: PropTypes.shape({}).isRequired,
    isEditMode: PropTypes.bool,
  };

  static defaultProps = {
    isEditMode: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      endAt: '23:59:59',
      error: '',
      startAt: '00:00:00',
    };

    this.handleApply = this.handleApply.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
  }

  handleApply() {
    const { endAt, startAt } = this.state;
    const { delegate, formValues } = this.props;
    if (areAnyChecked(formValues)) {
      days.forEach((day) => {
        if (formValues[day]) {
          delegate.handleChange(`${abbrv(day)}StartAt`, startAt);
          delegate.handleChange(`${abbrv(day)}EndAt`, endAt);
        }
      });
    } else {
      days.forEach((day) => {
        delegate.handleChange(`${abbrv(day)}StartAt`, startAt);
        delegate.handleChange(`${abbrv(day)}EndAt`, endAt);
        delegate.handleChange(day, true);
      });
    }
  }

  handleChangeCheckbox(isChecked, day) {
    const { delegate } = this.props;
    if (!isChecked) {
      delegate.handleChange(endAtName(day), null);
      delegate.handleChange(startAtName(day), null);
    }
  }

  handleChangeInput(value, edge) {
    const validValue = value.length === 5 ? `${value}:00` : value;
    const endAt = edge === 'end' ? validValue : this.state.endAt; // eslint-disable-line
    const startAt = edge === 'start' ? validValue : this.state.startAt; // eslint-disable-line
    this.setState({
      error: +startAt.replace(/:/g, '') > +endAt.replace(/:/g, '') ? 'Start at time must be earlier than end at time.' : '',
      [`${edge}At`]: validValue,
    });
  }

  render() {
    const { endAt, error, startAt } = this.state;
    const { formValues, isEditMode } = this.props;
    return (
      <Card>
        <CardHeader>Schedule</CardHeader>
        <CardBody indent>
          <FormGroup inline className="mb-4">
            <Label className="mr-2">range</Label>
            <InputGroup>
              <Input
                disabled={!isEditMode}
                onChange={(e) => this.handleChangeInput(e.target.value, 'start')}
                size="sm"
                step="1"
                type="time"
                value={startAt}
              />
            </InputGroup>
            <Label className="ml-2 mr-2">to</Label>
            <InputGroup>
              <Input
                className="mr-2"
                disabled={!isEditMode}
                onChange={(e) => this.handleChangeInput(e.target.value, 'end')}
                size="sm"
                step="1"
                type="time"
                value={endAt}
              />
              <Button
                color="secondary"
                disabled={!isEditMode || !!error}
                onClick={this.handleApply}
                outlineText
                size="sm"
              >
                {`apply to ${areAnyChecked(formValues) ? 'checked' : 'all'}`}
              </Button>
            </InputGroup>
            {
              error
              && <FormText color="danger" className="ml-2">{ error }</FormText>
            }
          </FormGroup>
          {
            days.map((day) => (
              <FormGroup inline className="mb-2" key={day}>
                <Field
                  className="mr-2"
                  component={CheckboxField}
                  disabled={!isEditMode}
                  name={day}
                  onChange={(e, isChecked) => this.handleChangeCheckbox(isChecked, day)}
                  size="sm"
                />
                <Label style={{ justifyContent: 'left', minWidth: '5rem' }}>{ startCase(day) }</Label>
                <Field
                  areSecondsAllowed
                  className="ml-2"
                  component={TimePickerField}
                  disabled={!isEditMode || !formValues[day]}
                  name={startAtName(day)}
                  size="sm"
                />
                <Label>to</Label>
                <Field
                  areSecondsAllowed
                  className="ml-2"
                  component={TimePickerField}
                  disabled={!isEditMode || !formValues[day]}
                  name={endAtName(day)}
                  size="sm"
                />
              </FormGroup>
            ))
          }
          <Field
            className="mt-4"
            component={NumberField}
            label="Priority"
            max={65535}
            min={0}
            name="priority"
            precision={0}
            disabled={!isEditMode}
            strict
          />
        </CardBody>
      </Card>
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(ScheduleFields);
