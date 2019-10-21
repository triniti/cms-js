# DividerBlockPreview

This is the preview component for `divider-block` blocks. It is used in:
+ The `DividerBlockModal` (see `@triniti/cms/plugins/blocksmith/components/divider-block-modal`)
+ The `DividerBlockPlaceholder` (see `@triniti/cms/plugins/blocksmith/components/divider-block-placeholder`)
+ Node preview components (eg the `ArticlePreviewModal`, see `@triniti/cms/plugins/news/components/article-preview-modal`). When used in a preview component, it is retrieved by the `resolver`'s `getPreview` function (see `@triniti/cms/plugins/blocksmith/resolver.js`).

### Required props
+ `block` - A `divider-block` block (uses mixin `triniti:canvas:mixin:divider-block`).

### Optional Props
+ `className` - A classname to use.

### FYI
+ See the [Triniti divider block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/divider-block).
