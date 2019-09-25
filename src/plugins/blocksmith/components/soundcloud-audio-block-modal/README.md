# SoundcloudAudioBlockModal

This is the modal that is opened by the `soundcloud-audio-block` `SidebarButton` (see `@triniti/cms/plugins/blocksmith/components/sidebar-buttons/soundcloud-audio-block-sidebar-button`) when creating a new block or by the `EditButton` (see `@triniti/cms/plugins/blocksmith/components/edit-block-button`) when editing an existing soundcloud audio block.

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
+ It only takes iframe embed codes as input.
+ See the [Triniti soundcloud audio block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/soundcloud-audio-block).
