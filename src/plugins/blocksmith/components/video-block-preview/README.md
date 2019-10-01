# VideoBlockPreview

This is the preview component for `video-block` blocks. It is used in:
+ The `VideoBlockModal` (see `@triniti/cms/plugins/blocksmith/components/video-block-modal`)
+ The `VideoBlockPlaceholder` (see `@triniti/cms/plugins/blocksmith/components/video-block-placeholder`)
+ Node preview components (eg the `ArticlePreviewModal`, see `@triniti/cms/plugins/news/components/article-preview-modal`). When used in a preview component, it is retrieved by the `resolver`'s `getPreview` function (see `@triniti/cms/plugins/blocksmith/resolver.js`).

### Required props
+ `block`     - A `video-block` block (uses mixin `triniti:canvas:mixin:video-block`).
+ `videoNode` - The block's associated image node (uses mixin `triniti:ovp:mixin:video`).

### Optional Props
+ `imageNode` - Message using mixin `triniti:dam:mixin:image-asset`, used as poster image.

### FYI
+ See the [Triniti video block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/video-block).
