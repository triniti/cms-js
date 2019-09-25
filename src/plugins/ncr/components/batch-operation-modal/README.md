# Batch Operation Modal
This component will render the batch operation results by opening a modal.
Using the progress bar, user will be able to see the real-time progress on the running batch operation.

### Props
+ `nodeLabel` - A string and signifies the kind of nodes to perform batch operation. This is optional and if not set, will have a value of "nodes".
+ `onCloseModal` - A function and is optional. Component's user will be able to write some custom code to execute as soon as the modal finished closing. 
                   Example would be to unselect all selected checkboxes or perform some ajax calls.

### How to Use
```jsx harmony
import BatchOperationModal from '@triniti/cms/plugins/ncr/components/batch-operation-modal';
const label = 'pages';
<BatchOperationModal
  nodeLabel={label}
  onCloseModal={() => this.setState({ selectedValues: []})}
/>
```
