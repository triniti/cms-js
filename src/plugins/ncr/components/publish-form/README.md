# Publish Form
This component renders the form for updating status of a particular node.

### Props
+ `node` - An instance of `Node` to update status. This is optional and if not set, will render a disabled component.
+ `onOperationChange` - Function. Optional. Will called everytime a user selects a new operation from the dropdown if function exists.
+ `schemas` - Object. instance of `Schema` properties to use for creating create commands.
    1. publishNode - is required and contains the schema to publish a node.
    2. unpublishNode - is required and contains the schema to unpublish a node.
    3. markNodeAsDraft - is optional and contains the schema to mark the node as draft.
    4. markNodeAsPending - is optional and contains the schema to mark the node as pending.
+ `formName` - String, the name of the form for editing this particular node.
+ `disabled` - Boolean, optional and defaults to false. If true, the component is disabled else enabled.
+ `disabledReasonMessage` - String, optional and displays a text for the reason why the publish form component is disabled.
   


### How to Use
```jsx harmony
import PublishForm from '@triniti/cms/plugins/ncr/components/publish-form';
<PublishForm
  node={Node}
  key="publishForm"
  formName="trinitiNewsArticleForm"
  onOperationChange={this.setState({ publishOperation: 'Schedule' })}
  schemas={
    publishNode: schemas.publishBlah,
    unpublishNode: schemas.unpublishBlah,
    markNodeAsDraft: schemas.markBlahAsDraft,
    markNodeAsPending: schemas.markBlahAsPending,
  }
  disabled={false}
/>
```

### Delegate
+ `handleChangeStatus` - Function, main function to call when changing the node's status. Accepts the name of the operation to perform . 
   A designated ActionCreator type will be selected through the provided operation and consequently dispatches the action.
   
   Example:
     `handleChangeStatus('Marked As Draft', { date, time });`
     
     1. operation - string, the operation to perform. Possible values are 'Reschedule', 'Schedule', etc.
     2. date - date, the publish date
     3. time - time, the publish time
    



### Actions Types
+ `PUBLISH_NODE_REQUESTED`
+ `UNPUBLISH_NODE_REQUESTED`
+ `MARK_NODE_AS_DRAFT_REQUESTED`
+ `MARK_NODE_AS_PENDING_REQUESTED`


### Sagas
+ `publishNodeFlow` - Function, accepts a param object with pbj property and submits the request to publish the node.
+ `unpublishNodeFlow` - Function, accepts a param object with pbj property and submits the request to unpublish the node.
+ `markNodeAsPendingFlow` - Function, accepts a param object with pbj property and submits the request to mark the node as pending.
+ `markNodeAsDraftFlow` - Function, accepts a param object with pbj property and submits the request to mark the node as draft.


### UI Operations
+ `Publish Now` - transform the node to its published state through the `publishNodeFlow` saga.
+ `Schedule` - transform the node to its scheduled state through the `publishNodeFlow` saga.
+ `Reschedule` - transform the node to its re-scheduled state through the `publishNodeFlow` saga.
+ `UnPublish` - transform the node to its draft state through the `unpublishNodeFlow` saga. **Only allowed if the current node status is in published state**.
+ `Mark As Draft` - transform the node to its draft state through the `markNodeAsDraftFlow` saga. **Only allowed if the current node status is not in published state**.
+ `Mark As Pending` - transform the node to its pending state through the `markNodeAsPendingFlow` saga.
+ `Reschedule` - transform the node to its scheduled state through the `publishNodeFlow` saga.


---

### Logic Flow On Deriving Operations Per Node Status and Granted Permissions

Note that **canPublish**, **canUnpublish**, **canMarkAsPending**, and **canMarkAsDraft** determine allowed UI operations given to the user depending on the node status and user permissions.

Also **isPublishNodeGranted**, **isUnPublishNodeGranted**, **isMarkAsPendingGranted**, **isMarkAsDraftGranted** are user permission statuses that checks if a user have right to perform such operation.

[<img src="deriveNodeOperationStatuses.js.svg">]()
