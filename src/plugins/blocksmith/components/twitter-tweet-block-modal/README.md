# TwitterTweetBlockModal

This is the modal that is opened by the `twitter-tweet-block` `SidebarButton` (see `@triniti/cms/plugins/blocksmith/components/sidebar-buttons/twitter-tweet-block-sidebar-button`) when creating a new block or by the `EditButton` (see `@triniti/cms/plugins/blocksmith/components/edit-block-button`) when editing an existing twitter tweet block.

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
+ Caveat to above is if a direct url is used, tweet_text will not be set on the block.
+ See the [Triniti twitter tweet mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/twitter-tweet-block).
+ See the [Twitter tweet embed docs](https://dev.twitter.com/web/embedded-tweets).
