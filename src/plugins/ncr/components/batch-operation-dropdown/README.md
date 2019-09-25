# Batch Operation Dropdown
This component will render the batch operation dropdown that gives the user access to click the buttons on
triggerring batch operation. Current supported batch operations are "Batch Delete", "Batch Publish", and "Batch Mark As Draft".

### Props
+ `nodeLabel` - A string and signifies the kind of nodes to perform batch operation. This is optional and if not set, will have a value of "nodes".
+ `onUnSelectAllRows` - A function and is optional. Function when unselecting all selected rows. If not set, the "Unselect All" button will not be visible.
+ `nodeRefs` - A collection of instance `NodeRef` and is optional. If this is not set, it'll default to an empty array.
+ `schemas` - An object with instance of `Schema` properties to use for creating create commands.
    1. publishNode - is required and contains the schema to publish a node.
    2. deleteNode - is required and contains the schema to delete a node.
    3. markNodeAsDraft - is optional and contains the schema to mark the node as draft. If not set, the "Mark As Draft" button will not be shown.
+ `actions` - An optional object and contains the customization values for each node schemas mentioned above.

       Example:

        actions={{
           publishNode: {
             notGrantedMessage: 'Error: Not authorized to perform batch publish operation.',
             delay: 1000,
           },
           markNodeAsDraft: {
             notGrantedMessage: 'Error: Not authorized to perform batch mark article as draft operation.',
             delay: 1000,
           },
           deleteNode: {
             notGrantedMessage: 'Error: Not authorized to perform batch delete operation.',
             delay: 1000,
           },
         }}


### How to Use?
Example usage inside the "blah" plugin.

```jsx harmony
import BatchOperationDropdown from '@triniti/cms/plugins/ncr/components/batch-operation-dropdown';
<BatchOperationDropdown
  nodeRefs={selectedRows}
  schemas={{
    deleteNode: schemas.deleteBlah,
    markNodeAsDraft: schemas.markBlahAsDraft,
    publishNode: schemas.publishBlah,
  }}
  actions={{
    publishNode: {
      notGrantedMessage: 'Error: Not authorized to perform batch publish operation.',
      delay: 1000,
    },
    markNodeAsDraft: {
      notGrantedMessage: 'Error: Not authorized to perform batch mark blah as draft operation.',
      delay: 1000,
    },
    deleteNode: {
      notGrantedMessage: 'Error: Not authorized to perform batch delete operation of blahs.',
      delay: 1000,
    },
  }}
  nodeLabel="blah"
  onUnSelectAllRows={() => this.setState({ selectedRows: [] })}
/>
```
