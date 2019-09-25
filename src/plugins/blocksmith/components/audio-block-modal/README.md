# AudioBlockModal

This is the modal that is opened by the `audio-block` `SidebarButton` (see `@triniti/cms/plugins/blocksmith/components/sidebar-buttons/audio-block-sidebar-button`) when creating a new block or by the `EditButton` (see `@triniti/cms/plugins/blocksmith/components/edit-block-button`) when editing an existing audio block.

Although this is not currently used outside of Blocksmith, it could be used to edit/create blocks in another context.

### Required props
+ `block`                       - A triniti canvas block (not a Draft.js block).
+ `delegate`                    - The dispatch delegator.
+ `audioAssetNodes`             - The results of the `handleSearchAudioAssets` request.
+ `imageAssetNodes`             - The results of the `handleSearchImageAssets` request.
+ `isFreshBlock`                - Whether or not we are creating a new block (true) or editing an existing block (false)
+ `isAudioAssetSearchFulfilled` - Whether or not the `handleSearchAudioAssets` request is fulfilled.
+ `isImageAssetSearchFulfilled` - Whether or not the `handleSearchImageAssets` request is fulfilled.
+ `isFulfilled`                 - Whether or not the `searchNodes` request is fulfilled.
+ `onAddBlock`                  - What happens when a new block is created (maps to Blocksmith's `handleAddCanvasBlock`).
+ `onEditBlock`                 - What happens when an existing block is edited (maps to Blocksmith's `handleEditCanvasBlock`).
+ `toggle`                      - The modal toggle function.

### Optional Props
+ `audioAssetSort`              - How the audio assets have been sorted.
+ `audioNode`                   - When editing an existing audio block, this is the node_ref node.
+ `imageNode`                   - When editing an existing audio block, this is the image_ref node (if there is one).
+ `isOpen`                      - Whether or not the modal is open.
+ `node`                        - The node (eg article) that this modal is creating/editing for. Used by the image uploader to link uploaded images.

### FYI
+ See the [Triniti audio block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/audio-block).
