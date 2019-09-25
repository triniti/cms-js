# Blocksmith

This component manages a node's blocks. It is based on [Draft.js](https://draftjs.org/docs/overview.html#content) and [draft-js-plugins](https://github.com/draft-js-plugins/draft-js-plugins).

### Required Props
+ `blocksmithState` - The stored redux state of the Blocksmith, including the id (either formName or node id, see below) and isDirty flag.
+ `delegate` - The dispatch delegator.
+ `isEditMode` - Whether or not the Blocksmith is in edit mode.

### Optional Props
+ `formName` - The name of the form the Blocksmith is in. This is used as an identifier key for the blocksmithState in redux when the form is in a create screen.
+ `node` - The node of the screen the Blocksmith is in. The id is derived from this and used as an identifier key for the blocksmithState in redux when the form is not in a create screen.

### FYI
+ Each time EditorState.push is invoked, the third argument is optional, but indicates what type of change the push involves. See https://draftjs.org/docs/api-reference-editor-state.html#push and https://draftjs.org/docs/api-reference-editor-change-type.html#content. However, not all of the things we do with Draft.js map to the values provided in their enum. In those cases, the changeType is provided as `'arbitrary'` (custom type) or `null` (make it seem like nothing happened).
+ If you ever experience changes being lost it may be because of a race condition between setState and UNSAFE_componentWillReceiveProps. Waiting a tick to perform delegated action creators or putting them into setState callbacks can be helpful.
+ Each list item is a distinct draft ContentBlock. This results in many gotchas when deleting/reordering blocks.
+ It is best practice to set read-only when a modal is open.
+ Be very wary of UNSAFE_componentWillReceiveProps. It is very easy to lose decorators when merging in props.
