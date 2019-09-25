# Node Lock
This component will render the lock or unlock button for **authorized** users else it'll redirect **unauthorized** users away.
Using the buttons, **authorized** users will be able to lock down an unlocked node or vice versa from other cms users that are not authorized to perform such role.

### Render Logic
1. If node is **locked** and user is **unauthorized**, user will be redirected away from the node and to the orig. route he/she came from.
2. If node is **unlocked** and user is **unauthorized**, user will be able to load the node but no "NodeLock" button at all.
3. If node is **locked** and user is **authorized**, user will see/access the "NodeLock" button component with "Unlock" text.
4. If node is **unlocked** and user is **authorized**, user will see/access the "NodeLock" button component with "Lock" text.
5. Important: **This component should only be used with a lockable node.**

### Props (required)
+ `canLock` - type `Boolean` and determines if user is authorized to lock a node.
+ `canUnlock` - type `Boolean` and determines if user is authorized to unlock a node.
+ `delegate` - type `Object`, the delegate factory.

### Props (not required)
+ `lockButtonText` - type `String` displays the text for the lock button and defaults to "Lock".
+ `unlockButtonText` - type `String` displays the text for the unlock button and defaults to "Unlock".
+ `node` - type `Object` and instance of Message. The node to lock or unlock and defaults to null.

### Delegate Props
+ `nodeLabel` - type `String` and used to display the name of the node ( Ex. Article ). Defaults to "Node".
+ `node` - required and of type `Object`. An instance of a Message. The node to lock or unlock.
+ `schemas` - type `Object` and an instance of `Schema` properties to use for creating commands.

### Delegate Functions
+ `handleUnlock` - called to unlock a locked node.
+ `handleLock` - called to lock a unlocked node.
+ `handleRedirect` - dispatches an alert and clear actions and returns a string to redirect an **unauthorized** user.

### Actions Types
+ `LOCK_NODE_REQUESTED`
+ `UNLOCK_NODE_REQUESTED`


### How to Use
```jsx harmony
import NodeLock from '@triniti/cms/plugins/ncr/components/node-lock';
const { delegate, nodeSchema, schemas } = this.props;
// important to check if the node is lockable
const isNodeLockable = nodeSchema.hasMixin('gdbots:ncr:mixin:lockable');
isNodeLockable && <NodeLock node={delegate.getNode()} schemas={schemas} />
```
