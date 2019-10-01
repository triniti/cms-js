# ArticleBlockPreview

This is the preview component for `article-block` blocks. It is used in:
+ The `ArticleBlockModal` (see `@triniti/cms/plugins/blocksmith/components/article-block-modal`)
+ The `ArticleBlockPlaceholder` (see `@triniti/cms/plugins/blocksmith/components/article-block-placeholder`)
+ Node preview components (eg the `ArticlePreviewModal`, see `@triniti/cms/plugins/news/components/article-preview-modal`). When used in a preview component, it is retrieved by the `resolver`'s `getPreview` function (see `@triniti/cms/plugins/blocksmith/resolver.js`).

### Required props
+ `articleNode` - The block's associated article node. From selector.
+ `block`       - A `article-block` block (uses mixin `triniti:canvas:mixin:article-block`).

### Optional Props
+ `className`   - String for css class name(s).
+ `imageNode`   - Message using mixin `triniti:dam:mixin:image-asset`, used as poster image.

### FYI
+ See the [Triniti article block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/article-block).
