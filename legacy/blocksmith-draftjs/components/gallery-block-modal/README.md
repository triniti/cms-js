# GalleryBlockModal

This is the modal that is opened by the `gallery-block` `SidebarButton` (see `@triniti/cms/plugins/blocksmith/components/sidebar-buttons/gallery-block-sidebar-button`) when creating a new block or by the `EditButton` (see `@triniti/cms/plugins/blocksmith/components/edit-block-button`) when editing an existing gallery block.

Although this is not currently used outside of Blocksmith, it could be used to edit/create blocks in another context.

### Required Props
+ `block`        - A triniti canvas block (not a Draft.js block).
+ `delegate`     - The dispatch delegator
+ `galleries`    - Gallery nodes from the `searchNodes` request.
+ `isFreshBlock` - Whether or not we are creating a new block (true) or editing an existing block (false)
+ `isFulfilled`  - Whether or not the `searchNodes` request is fulfilled.
+ `toggle`       - The modal toggle function.
+ `onAddBlock`   - What happens when a new block is created (maps to Blocksmith's `handleAddCanvasBlock`).
+ `onEditBlock`  - What happens when an existing block is edited (maps to Blocksmith's `handleEditCanvasBlock`).

### Optional Props
+ `gallery`      - If editing an existing block, this is the gallery node of the block's `node_ref` field.
+ `isOpen`       - Whether or not the modal is open.

### FYI
+ See the [Triniti gallery block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/gallery-block).