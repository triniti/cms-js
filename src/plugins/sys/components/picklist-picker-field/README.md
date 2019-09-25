# PicklistPickerField
  It renders a `PicklistPickerField` component with options related to the given picklist id. It works only when passed in as a _component prop_ to the redux-form `Field` component.
  
###Required Props

**picklistId**: `String`

The picklist identifier. The system will get all pick options based on the given `picklistId`. The picklist querying for should exist prior to requesting it. **Picklists** can be created under **Admin >> Picklists**  

**input**: `Object`

This prop is provided by redux-form, a name (of type `string`) prop must be passed to `Field` component since it is required. 

[More info on Field component](https://redux-form.com/7.3.0/docs/api/field.md/)


###Optional Props
**isEditMode**: `boolean` default is `false`

**label**: `string` or `integer`

**multi**: `boolean` default value is `false`

**PicklistPickerField supports all [react-datepicker](https://reactdatepicker.com/) options**

### How to use

```jsx harmony
import { Field } from 'redux-form';
import PicklistPickerField from '@triniti/components/picklist-picker-field';

<Field
  component={PicklistPickerField}
  isEditMode={true}
  label="Date"
  name="date"
  picklistId="picklist-1" 
  />
```

