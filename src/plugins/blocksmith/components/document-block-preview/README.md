# DocumentBlockPreview

This is the preview component for `document-block` blocks. It is used in:
+ The `DocumentBlockModal` (see `@triniti/cms/plugins/blocksmith/components/document-block-modal`)
+ The `DocumentBlockPlaceholder` (see `@triniti/cms/plugins/blocksmith/components/document-block-placeholder`)
+ Node preview components (eg the `ArticlePreviewModal`, see `@triniti/cms/plugins/news/components/article-preview-modal`). When used in a preview component, it is retrieved by the `resolver`'s `getPreview` function (see `@triniti/cms/plugins/blocksmith/resolver.js`).

### Required props
+ `documentNode` - The block's associated document node (uses mixin `triniti:dam:mixin:document-asset`). From selector.
+ `block`     - A `document-block` block (uses mixin `triniti:canvas:mixin:document-block`).

### Optional Props
+ `className`    - String for css class name(s).
+ `imageNode` - Message using mixin `triniti:dam:mixin:image-asset`, used as poster image.

### FYI
+ See the [Triniti document block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/document-block).
