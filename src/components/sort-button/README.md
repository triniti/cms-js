# SortButton
This component is used to render a sort button on a table's header column.

### Props
+ `currentSort` - a type `String` and is required. The current active sort field name. Example values are `title-asc`, `relevance`, etc.
+ `onSort` - a type `Function` and is required. The function to fire when user clicks the button and performs sorting.<br />
   **Here's an example of an onSort function. Note that `newSort` variable is either the `sortfieldAsc` or `sortFieldDesc`**:
   ```jsx harmony
      (newSort) => { // ...call your sorting function here }
   ```
+ `sortFieldAsc` - a type `String` and is required. The sort name for sorting in ascending order. Example values are `title-asc`, `updated-at-asc`, `published-at-asc` etc. 
+ `sortFieldDesc` - a type `String` and is required. The sort name for sorting in descending order. Example values are `title-desc`, `updated-at-desc`, `published-at-desc` etc. 

### How to Use?
 ###### Example Inside a TableHeader component
```jsx harmony
... more code before
import SortButton from '@triniti/cms/components/sort-button';

const TableHeader = ({ onSort, sort }) => (
  <thead>
    <tr>
      <th />
      <th>
        Title
        &nbsp;
        <SortButton
          currentSort={sort}
          onSort={onSort}
          sortFieldAsc="title-asc"
          sortFieldDesc="title-desc"
        />
      </th>
      <th>..... more code after
```
