# LegendSelect
An extended/customized "React Select" component that serves as a legend and renders a dropdown of color-coded options 
by using each provided option value as a classname with a specific color representation.

### Required Props
+ `onChange` - function to call when the onChange event occurs.
+ `options` - an array of objects and are displayed as options that can be selected by the users.
+ `name` - a type string and used as a name property.

### Optional Props
+ `placeholder` - a type string (default: `'Select:'`) and will be displayed as a label when nothing/none is selected.
+ `value` - a type object (default: `null`) and the one selected out of the provided `options`.



### How to Use
```jsx harmony
import LegendSelect from '@triniti/cms/plugins/common/components/search-filter-select';
const statusOptions = [
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
  { label: 'Deleted', value: 'deleted' },
];
<LegendSelect 
  name="status"
  placeholder="Select status:"
  onChange={(selectedOption) => {
    // logic here when user selected an option
    console.log(selectedOption);
  }}
  options={statusOptions}
  value={
    statusOptions.find(option => option.value === statuses[0])
  }
/>
```
