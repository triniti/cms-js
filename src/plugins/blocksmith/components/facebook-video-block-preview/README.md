# FacebookVideoBlockPreview

This is the preview component for `facebook-video-block` blocks. It is used in:
+ The `FacebookVideoBlockModal` (see `@triniti/cms/plugins/blocksmith/components/facebook-video-block-modal`)
+ Node preview components (eg the `ArticlePreviewModal`, see `@triniti/cms/plugins/news/components/article-preview-modal`). When used in a preview component, it is retrieved by the `resolver`'s `getPreview` function (see `@triniti/cms/plugins/blocksmith/resolver.js`).

### Required Props
+ `block` - A `facebook-video-block` block (uses mixin `triniti:canvas:mixin:facebook-video-block`).

### Optional Props
+ `imageNode` - Message using mixin `triniti:dam:mixin:image-asset`, used as poster image.

### FYI
+ See the [Triniti facebook video block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/facebook-video-block).
+ See the [Facebook embedded video docs](https://developers.facebook.com/docs/plugins/embedded-video-player)
