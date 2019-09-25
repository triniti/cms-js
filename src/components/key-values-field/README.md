# KeyValuesField
This component initally renders a button which, when clicked, will add new sets of `TextField`s with corresponding delete buttons. It should be used as a component prop to `redux-form`'s `FieldArray` component.

### Optional Props
+ `keyPlaceholder` - The text placeholder for the key `TextField`. Defaults to 'Enter name'
+ `label`          - A label for the `FieldArray`. Defaults to null, falls back to the field name.
+ `readOnly`       - Whether or not the fields are read only.
+ `valuePlaceholder` - The text placeholder for the value `TextField`.

### How to Use
```jsx harmony
import { FieldArray } from 'redux-form';
import KeyValuesField from '@triniti/cms/components/key-values-field';

<FieldArray name="tags" component={KeyValuesField} />
```
