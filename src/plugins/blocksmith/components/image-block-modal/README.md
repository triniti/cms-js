# ImageBlockModal

This is the modal that is opened by the `image-block` `SidebarButton` (see `../blocksmith/components/sidebar-buttons/image-block`) when creating a new block or by the `EditButton` (see `../blocksmith/components/block-buttons/edit-button`) when editing an existing image block.

Although this is not currently used outside of Blocksmith, it could be used to edit/create blocks in another context.

### Required Props
+ `block`        - A triniti canvas block (not a Draft.js block).
+ `delegate`     - The dispatch delegator
+ `images`       - Image nodes from the `searchNodes` request.
+ `isFreshBlock` - Whether or not we are creating a new block (true) or editing an existing block (false)
+ `isFulfilled`  - Whether or not the `searchNodes` request is fulfilled.
+ `toggle`       - The modal toggle function.
+ `onAddBlock`   - What happens when a new block is created (maps to Blocksmith's `handleAddCanvasBlock`).
+ `onEditBlock`  - What happens when an existing block is edited (maps to Blocksmith's `handleEditCanvasBlock`).

### Optional Props
+ `image`        - If editing an existing block, this is the image node of the block's `node_ref` field.
+ `isOpen`       - Whether or not the modal is open.
+ `node`         - The node (eg article) that this modal is creating/editing for. Used by the image uploader to link uploaded images.

### FYI
+ See the [Triniti image block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/image-block).
+ See the schema in `/schemas/schemas/[vendor]/canvas/block/image-block`.
