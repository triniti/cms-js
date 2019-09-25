# TextBlockModal

This is the modal that is opened by the `EditButton` (see `@triniti/cms/plugins/blocksmith/components/edit-block-button`) when editing an existing text block.

Although this is not currently used outside of Blocksmith, it could be used to edit/create blocks in another context.

### Required Props
+ `block`       - A triniti canvas block (not a Draft.js block).
+ `toggle`      - The modal toggle function.
+ `onEditBlock` - What happens when an existing block is edited (maps to Blocksmith's `handleEditCanvasBlock`).

### Optional Props
+ `isOpen`      - Whether or not the modal is open.

### FYI
+ See the [Triniti text block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/text-block).
