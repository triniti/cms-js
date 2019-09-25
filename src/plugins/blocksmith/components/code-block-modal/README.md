# CodeBlockModal

This is the modal that is opened by the `code-block` SidebarButton (see `@triniti/cms/plugins/blocksmith/components/sidebar-buttons/code-block-sidebar-button`) when creating a new block or by the `EditButton` (see `@triniti/cms/plugins/blocksmith/components/edit-block-button`) when editing an existing code block.

Although this is not currently used outside of Blocksmith, it could be used to edit/create blocks in another context.

### Required Props
+ `block`        - A triniti canvas block (not a Draft.js block).
+ `toggle`       - The modal toggle function.
+ `isFreshBlock` - Whether or not we are creating a new block (true) or editing an existing block (false)
+ `onAddBlock`   - What happens when a new block is created (maps to Blocksmith's `handleAddCanvasBlock`).
+ `onEditBlock`  - What happens when an existing block is edited (maps to Blocksmith's `handleEditCanvasBlock`).

### Optional Props
+ `isOpen`       - Whether or not the modal is open.

### FYI
+ See the [Triniti code block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/code-block).
+ See the schema in `/schemas/schemas/[vendor]/canvas/block/code-block`.
+ There has been discussion of updating the logic in this button such that if someone were to paste in an iframe code (for example), it would prompt the user to use the iframe block instead. Same for social embeds and all other block types (if another existed, it would recommend/force using that instead).
+ There is currently no preview for this block type (haven't decided how that would work yet).
