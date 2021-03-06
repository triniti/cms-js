# PollGridBlockModal

This is the modal that is opened by the `poll-grid-video-block` `SidebarButton` (see `@triniti/cms/plugins/blocksmith/components/sidebar-buttons/poll-grid-block-sidebar-button`) when creating a new block or by the `EditButton` (see `@triniti/cms/plugins/blocksmith/components/edit-block-button`) when editing an existing poll grid block.

Although this is not currently used outside of Blocksmith, it could be used to edit/create blocks in another context.

### Required Props
+ `block`        - A triniti canvas block (not a Draft.js block).
+ `toggle`       - The modal toggle function.
+ `isFreshBlock` - Whether or not we are creating a new block (true) or editing an existing block (false)
+ `onAddBlock`   - What happens when a new block is created (maps to Blocksmith's `handleAddCanvasBlock`).
+ `onEditBlock`  - What happens when an existing block is edited (maps to Blocksmith's `handleEditCanvasBlock`).

### Optional Props
+ `pollRefs`     - If editing an existing block, this is the array of poll node refs of the block.
+ `isOpen`       - Whether or not the modal is open.

### FYI
+ See the [Triniti poll grid block mixin](https://github.com/triniti/schemas/blob/master/schemas/triniti/canvas/mixin/poll-grid-block/latest.xml).
