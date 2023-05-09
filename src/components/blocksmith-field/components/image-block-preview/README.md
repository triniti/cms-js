# ImageBlockPreview

This is the preview component for `image-block` blocks. It is used in:
+ The `ImageBlockModal` (see `../image-block-modal`)
+ The `ImageBlockPlaceholder` (see `../blocksmith/components/placeholders/image-block`)
+ Node preview components (eg the `ArticlePreviewModal`, see `@triniti/cms/plugins/news/components/article-preview-modal`). When used in a preview component, it is retrieved by the `resolver`'s `getPreview` function (see `@triniti/cms/plugins/blocksmith/resolver.js`).

### Required props
+ `block`     - A `image-block` block (uses mixin `triniti:canvas:mixin:image-block`).
+ `imageNode` - The block's associated image node (uses mixin `triniti:dam:mixin:image-asset`).

### FYI
+ See the [Triniti image block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/image-block).
+ See the schema in `/schemas/schemas/[vendor]/canvas/block/image-block`.