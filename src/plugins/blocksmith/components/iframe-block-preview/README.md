# IframeBlockPreview

This is the preview component for `iframe-block` blocks. It is used in:
+ The `IframeBlockModal` (see `@triniti/cms/plugins/blocksmith/components/iframe-block-modal`)
+ Node preview components (eg the `ArticlePreviewModal`, see `@triniti/cms/plugins/news/components/article-preview-modal`). When used in a preview component, it is retrieved by the `resolver`'s `getPreview` function (see `@triniti/cms/plugins/blocksmith/resolver.js`).

### Required props
+ `block` - A `iframe-block` block (uses mixin `triniti:canvas:mixin:iframe-block`).

### FYI
+ [Triniti iframe block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/iframe-block/latest.xml).
+ See the schema in `/schemas/schemas/[vendor]/canvas/block/iframe-block`.
