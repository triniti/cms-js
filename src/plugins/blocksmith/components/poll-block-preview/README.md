# PollBlockPreview

This is the preview component for `page-break-block` blocks. It is used in:
+ The `PageBreakBlockModal` (see `@triniti/cms/plugins/blocksmith/components/page-break-block-modal`)
+ The `PageBreakBlockPlaceholder` (see `@triniti/cms/plugins/blocksmith/components/page-break-block-placeholder`)
+ Node preview components (eg the `ArticlePreviewModal`, see `@triniti/cms/plugins/news/components/article-preview-modal`). When used in a preview component, it is retrieved by the `resolver`'s `getPreview` function (see `@triniti/cms/plugins/blocksmith/resolver.js`).

### Required props
+ `block`    - A `poll-block` block (uses mixin `triniti:canvas:mixin:poll-block`).
+ `pollNode` - The block's associated poll node.

### Optional Props
+ `className`       - A classname to use.

### FYI
+ See the [Triniti poll block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/poll-block).
+ See the schema in `/schemas/schemas/[vendor]/canvas/block/poll-block`.
