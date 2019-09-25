# DateTimePicker

This is a DateTime picker component

### Required Props
+ `onChangeDate` - What happens when the date portion of this component is interacted with. Returns a moment date.
+ `onChangeTime` - What happens when the time portion of this component is interacted with. Returns a string representing time in hh:mm format (eg '14:21')
+ `updatedDate` - The date that hydrates the picker. It is assumed that when `onChangeDate` and `onChangeTime` are called, they will be updating their own date and passing it back in.

### FYI
+ `onChangeDate` and `onChangeTime` can use the `changedDate` and `changedTime` utils, or their own custom logic. For example:

#### Using the utils
```jsx harmony
import changedDate from '@triniti/cms/plugins/blocksmith/utils/changedTime';
import changedTime from '@triniti/cms/plugins/blocksmith/utils/changedTime';
import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';

class Thing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updatedDate: moment(),
    };
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
  }

  handleChangeDate(date) {
    this.setState(changedDate(date));
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(changedTime(time));
  }

  render() {
    const { updatedDate } = this.state;

    return (
        <DateTimePicker
          onChangeDate={this.handleChangeDate}
          onChangeTime={this.handleChangeTime}
          updatedDate={updatedDate}
        />
    );
  }
}
```

#### Using custom component-bound handler logic
```jsx harmony
import changedDate from '@triniti/cms/plugins/blocksmith/utils/changedTime';
import changedTime from '@triniti/cms/plugins/blocksmith/utils/changedTime';
import DateTimePicker from '@triniti/cms/plugins/blocksmith/components/date-time-picker';

class Thing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updatedDate: moment(),
    };
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
  }

  handleChangeDate(date) {
    this.setState(({ updatedDate }) => ({
      updatedDate: updatedDate
        .set('year', date.get('year'))
        .set('month', date.get('month'))
        .set('date', date.get('date')),
    }));
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(({ updatedDate }) => ({
      updatedDate: updatedDate
        .set('hours', time ? time.split(':')[0] : 0)
        .set('minutes', time ? time.split(':')[1] : 0),
    }));
  }

  render() {
    const { updatedDate } = this.state;

    return (
        <DateTimePicker
          onChangeDate={this.handleChangeDate}
          onChangeTime={this.handleChangeTime}
          updatedDate={updatedDate}
        />
    );
  }
}
```
