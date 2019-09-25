# CodeBlockPreview

This is the preview component for `code-block` blocks. It is used in:
+ The `CodeBlockModal` (see `@triniti/cms/plugins/blocksmith/components/code-block-modal`)
+ Node preview components (eg the `ArticlePreviewModal`, see `@triniti/cms/plugins/news/components/article-preview-modal`). When used in a preview component, it is retrieved by the `resolver`'s `getPreview` function (see `@triniti/cms/plugins/blocksmith/resolver.js`).

### Required Props
+ `block` - A `code-block` block (uses mixin `triniti:canvas:mixin:code-block`).

### FYI
+ See the [Triniti code block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/code-block).
