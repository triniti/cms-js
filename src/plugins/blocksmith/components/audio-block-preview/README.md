# AudioBlockPreview

This is the preview component for `audio-block` blocks. It is used in:
+ The `AudioBlockModal` (see `@triniti/cms/plugins/blocksmith/components/audio-block-modal`)
+ The `AudioBlockPlaceholder` (see `@triniti/cms/plugins/blocksmith/components/audio-block-placeholder`)
+ Node preview components (eg the `ArticlePreviewModal`, see `@triniti/cms/plugins/news/components/article-preview-modal`). When used in a preview component, it is retrieved by the `resolver`'s `getPreview` function (see `@triniti/cms/plugins/blocksmith/resolver.js`).

### Required props
+ `audioNode` - The block's associated audio node (uses mixin `triniti:dam:mixin:audio-asset`). From selector.
+ `block`     - A `audio-block` block (uses mixin `triniti:canvas:mixin:audio-block`).

### Optional Props
+ `className` - String for css class name(s).
+ `imageNode` - Message using mixin `triniti:dam:mixin:image-asset`, used as poster image.

### FYI
+ See the [Triniti audio block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/audio-block).
