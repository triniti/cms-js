# InstagramMediaBlockModal

This is the modal that is opened by the `instagram-media-block` `SidebarButton` (see `@triniti/cms/plugins/blocksmith/components/sidebar-buttons/instgram-media-sidebar-button`) when creating a new block or by the `EditButton` (see `@triniti/cms/plugins/blocksmith/components/edit-block-button`) when editing an existing instagram media block.

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
+ It _should_ be able to take multiple input formats such as direct url, iframe embed code, etc.
+ See the [Triniti instagram media block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/instagram-media-block).
+ See the [Instagram embed docs](https://www.instagram.com/developer/embedding/)
