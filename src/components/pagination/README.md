# Pagination

This component renders pagers for any search results.

### Required Props
+ `total` - Integer, total count of results.
+ `currentPage` - Integer, the current page for the result.
+ `onChangePage` - A function which provides the page number as arugument for callback. 

### Optional Props
+ `perPage` - Integer, define how many records will display per page. (default: `25`).
+ `maxPager` - Integer, which define how many pager units display on the page. (default: `5`).
+ `first` - Boolean, always display the first page Pager. (default: `true`).
+ `last` - Boolean, always display the last page Pager. (default: `true`).

### How to Use
```
import Pagination from '@triniti/cms/components/pagination';

<div>
  ...other components
  <Table or List to display current results />,
  <Pagination total={response.get('total)} currentPage={request.get('page')} onChangePage={(nextPage) => handleSearch(nextPage)} />,
</div>
```
