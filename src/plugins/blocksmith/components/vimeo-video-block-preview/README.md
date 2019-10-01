# VimeoVideoBlockPreview

This is the preview component for `vimeo-video-block` blocks. It is used in:
+ The `VimeoVideoBlockModal` (see `@triniti/cms/plugins/blocksmith/components/vimeo-video-block-modal`)
+ The `VimeoVideoBlockPlaceholder` (see `@triniti/cms/plugins/blocksmith/components/vimeo-video-block-placeholder`)
+ Node preview components (eg the `ArticlePreviewModal`, see `@triniti/cms/plugins/news/components/article-preview-modal`). When used in a preview component, it is retrieved by the `resolver`'s `getPreview` function (see `@triniti/cms/plugins/blocksmith/resolver.js`).

### Required Props
+ `block`     - A `vimeo-video-block` block (uses mixin `triniti:canvas:mixin:vimeo-video-block`).
+ `width`     - The width of the vimeo video embed.

### Optional Props
+ `imageNode` - Message using mixin `triniti:dam:mixin:image-asset`, used as poster image.

### FYI
+ See the [Triniti vimeo video block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/vimeo-video-block).
