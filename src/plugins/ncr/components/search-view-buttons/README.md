# Search View Buttons
This component will render a set of buttons that changes the displayed search view when clicked.
The component also remembers the selected view if the user leaves the search page and comes back.

At the time of this writing, available search views are "card" and "table".

### Props
+ `schema` - type Object. This is required and an instance of `Schema` properties to use as a key in determining the type of search nodes to implement.


### How to Use
```jsx harmony
import SearchViewButtons from '@triniti/cms/plugins/ncr/components/search-view-buttons';
import SearchPagesRequestV1Mixin from '@triniti/schemas/triniti/canvas/mixin/search-pages-request/SearchPagesRequestV1Mixin';
<SearchViewButtons
  schema={SearchPagesRequestV1Mixin.findOne()}
/>
```

### Delegate
+ `handleChangeView` - Function, main function to call when changing the search view. Accepts the name of the view. 
   A `searchNodesViewChanged` ActionCreator will be initiated and consequently dispatches the action.
   
   Example:
     `handleChangeView('cards');`

### Selector
+ Queries the store for the current name of the view. Returns an object with the view property.


### Actions Types
+ `SEARCH_NODES_VIEW_CHANGED`

