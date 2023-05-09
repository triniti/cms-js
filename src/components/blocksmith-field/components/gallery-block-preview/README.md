# GalleryBlockPreview

This is the preview component for `gallery-block` blocks. It is used in:
+ The `GalleryBlockModal` (see `@triniti/cms/plugins/blocksmith/components/gallery-block-modal`)
+ The `GalleryBlockPlaceholder` (see `@triniti/cms/plugins/blocksmith/components/gallery-block-placeholder`)
+ Node preview components (eg the `ArticlePreviewModal`, see `@triniti/cms/plugins/news/components/article-preview-modal`). When used in a preview component, it is retrieved by the `resolver`'s `getPreview` function (see `@triniti/cms/plugins/blocksmith/resolver.js`).

### Required props
+ `block`         - A `gallery-block` block (uses mixin `triniti:canvas:mixin:gallery-block`).
+ `galleryNode`   - The block's associated gallery node (uses mixin `triniti:curator:mixin:gallery`).
+ `handleGetNode` - Gets the image node if not lazy loaded.

### Optional Props
+ `className`     - A classname to use.
+ `imageNode`     - Message using mixin `triniti:dam:mixin:image-asset`, used as poster image.

### FYI
+ See the [Triniti gallery block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/gallery-block).