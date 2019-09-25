# DocumentBlockModal

This is the modal that is opened by the `document-block` `SidebarButton` (see `@triniti/cms/plugins/blocksmith/components/sidebar-buttons/document-block-sidebar-button`) when creating a new block or by the `EditButton` (see `@triniti/cms/plugins/blocksmith/components/edit-block-button`) when editing an existing document block.

Although this is not currently used outside of Blocksmith, it could be used to edit/create blocks in another context.

### Required props
+ `block`        - A triniti canvas block (not a Draft.js block).
+ `delegate`     - The dispatch delegator.
+ `nodes`        - The results of the `searchNodes` request.
+ `isFreshBlock` - Whether or not we are creating a new block (true) or editing an existing block (false)
+ `isFulfilled`  - Whether or not the `searchNodes` request is fulfilled.
+ `onAddBlock`   - What happens when a new block is created (maps to Blocksmith's `handleAddCanvasBlock`).
+ `onEditBlock`  - What happens when an existing block is edited (maps to Blocksmith's `handleEditCanvasBlock`).
+ `toggle`       - The modal toggle function.

### Optional Props
+ `document`     - When editing an existing document block, this is the node_ref node.
+ `image`        - When editing an existing document block, this is the image_ref node (if there is one).
+ `isOpen`       - Whether or not the modal is open.
+ `node`         - The node (eg article) that this modal is creating/editing for. Used by the image uploader to link uploaded images.
+ `sort`         - How to sort the nodes.

### FYI
+ See the [Triniti document block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/document-block).
