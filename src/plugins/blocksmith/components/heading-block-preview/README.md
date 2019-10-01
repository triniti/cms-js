# HeadingBlockPreview

This is the preview component for `heading-block` blocks. It is used in:
+ The `HeadingBlockModal` (see `@triniti/cms/plugins/blocksmith/components/heading-block-modal`)
+ The `HeadingBlockPlaceholder` (see `@triniti/cms/plugins/blocksmith/components/heading-block-placeholder`)
+ Node preview components (eg the `ArticlePreviewModal`, see `@triniti/cms/plugins/news/components/article-preview-modal`). When used in a preview component, it is retrieved by the `resolver`'s `getPreview` function (see `@triniti/cms/plugins/blocksmith/resolver.js`).

### Required props
+ `block`     - A `heading-block` block (uses mixin `triniti:canvas:mixin:heading-block`).

### Optional Props
+ `className` - A classname to use.

### FYI
+ See the [Triniti heading block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/heading-block).
