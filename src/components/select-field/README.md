# SelectField
  This component renders a `SelectField` and works only when passed as a prop for redux-form's `Field` component. It supports adding new values in to list when set prop `creatable=true`. 
   
### Required Props

+ input - auto generated when use as a `Field` prop in redux form, every `Field` component is required a `name` prop.

 [learn more about Field in redux-form](https://redux-form.com/7.2.3/docs/api/field.md/)

### Optional Props
+ label - String or Integer. (default: '')
+ disabled - Boolean. (default: `false`)
+ creatable - Boolean. (default: `false`)
+ options: Array, array of objects in `{ label: 'label', value: 'value' }` shape. (default: `[]`)

**SelectField supports all [react-select](https://github.com/JedWatson/react-select) options**


### How to Use
```jsx harmony
import { Field } from 'redux-form';
import SelectField from '@triniti/cms/components/select-field';

<Field
  name="name"
  component={SelectField}
  options={options}
  label="Display Title"
  multi
  creatable
/>
```

### ToDo
+ design and display warning and error messages if necessary.
+ support asynchronize feature (loading options, searching form remote, etc...).
