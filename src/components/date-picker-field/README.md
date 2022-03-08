# DatePickerField
  It renders a `DatePickerField` component with date and time picker. It works only when passed in as a _component prop_ to redux-form `Field` component.

###Required Props

**input**

This prop is provided by redux-form, a name prop must be passed to `Field` component since it is required.

[More info on Field component](https://redux-form.com/7.3.0/docs/api/field.md/)

###Optional Props

**className : String**

Default value - ''

**label : String or Integer**

Default value - ''

**placeholderText : String**

Default value is 'MM/DD/YYYY'

**showTime - Boolean**

Default is true

### How to use

```jsx harmony
import { Field } from 'redux-form';
import DatePickerField from '@triniti/components/datepicker-field';

<Field
  name="date"
  label="Date"
  component={DatePickerField}
  placeholderText='blah'
  className="foo bar"
/>
```

###ToDo
+ Add more options to the field to generalize it.
