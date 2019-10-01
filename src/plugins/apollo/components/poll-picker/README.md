# Poll Picker
A reusable component that comes with a picker and sort controls to reorder the items picked

### Optional Props
+ `autoload` - type `boolean` used to autoload items in `Picker` component. Defaults to `false`
+ `className` - type `string` passed on to the `Picker` component. Defaults to `empty string`
+ `closeOnSelect` - type `boolean` passed to the `Select` child component, to determine whether to close the 
menu when a value is selected. Defaults to `false`
+ `multi` - type `boolean` determines the ability to pick multiple options. Defaults to `true`
+ `selectedPolls` - type `array` array of selected poll nodeRefs. Default to `empty array`. 

### Required Props 
+ `onFilter` - type `function` passed down to SortableList (check `@triniti/cms/plugins/apollo/components/poll-picker/SortableList`)
+ `onMoveDown` - type `function` passed down to SortableList
+ `onMoveUp` - type `function` passed down to SortableList
+ `onPick` - type `function` passed down to Picker (check `@triniti/cms/plugins/apollo/components/poll-picker/Picker`)
+ `onSort` - type `function` passed down to SortableList

### How to use
```jsx harmony
import PollPicker from '@triniti/cms/plugins/apollo/components/poll-picker';
<PollPicker
  autoload
  className="sticky-top"
  onFilter={this.handleFilter}
  onMoveDown={this.handleMoveDown}
  onMoveUp={this.handleMoveUp}
  onPick={this.handlePick}
  onSort={this.handleReorder}
  selectedPolls={selectedPollRefs}
/>
```  
**Notes**

`styles.scss` file has the necessary css to hide some of the default `Select` styles
