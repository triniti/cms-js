# TextField
  This component renders a `TextField` and works only when passed as a prop for redux-form's `Field` component. 
  It also renders all warning and error messages from when `meta.warning` or `meta.error` accordingly. 
### Required Props

+ input - auto generated when use as a `Field` prop in redux form, every Field component is required a `name` prop.
+ meta - auto generated when use as a `Field` prop in redux form.

 [learn more about Field in redux-form](https://redux-form.com/7.2.3/docs/api/field.md/)

### Optional Props
+ label - String or Integer. (default: '')
+ readOnly - Boolean. (default: `false`)

**TextField supports all Reactstrap [Input](http://reactstrap.github.io/components/form/) props**


### How to Use
```jsx harmony
import { Field } from 'redux-form';
import TextField from '@triniti/cms/components/text-field';

<Field name="textField" component={TextField} readOnly={true} type="number" />
```
