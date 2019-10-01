# GoogleMapBlockModal

This is the modal that is opened by the `google-map-block` `SidebarButton` (see `@triniti/cms/plugins/blocksmith/components/sidebar-buttons/google-map-block-sidebar-button`) when creating a new block or by the `EditButton` (see `@triniti/cms/plugins/blocksmith/components/edit-block-button`) when editing an existing google map block.

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
+ Currently only takes manual inputs, although it could be adapted to take _some_ pasted input like `https://www.google.com/maps/@34.151912,-118.3423969,15z`. Probably don't want to get too clever with that though, some formats [are pretty crazy](https://stackoverflow.com/questions/18413193/how-do-i-decode-encode-the-url-parameters-for-the-new-google-maps).
+ See the [Triniti google map block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/google-map-block).
+ See the [Google map iframe docs](https://developers.google.com/maps/documentation/embed/guide)
