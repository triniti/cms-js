# MasterCheckbox
A component that renders a checkbox that has the ability to "check" or "uncheck"
all other checkboxes. Commonly used on search forms where user can select or unselect
items on the search result table.

### Optional Props
+ `onChange` - function to call when the onChange event occurs.
+ `checkAllLabel` - a string (default: `'check all'`) to display as a label when checkbox is not "checked".
+ `uncheckAllLabel` - a string (default: `'check all'`) to display as a label when checkbox is "checked".
+ `isSelected` -  a type boolean and determines if the component is "checked" or vice versa.


### How to Use
```jsx harmony
import MasterCheckbox from '@triniti/cms/components/master-checkbox';
<MasterCheckbox 
  onChange={() => this.setState({
       selectedRows: (selectedRows.length !== nodes.length) ?
         nodes.map(node => node.get('_id').toNodeRef()) : [],
     })
   } 
  isSelected={selectedRows.length === nodes.length}
/>
```
