# InstagramMediaBlockPreview

This is the preview component for `instagram-media-block` blocks. It is used in:
+ The `InstagramMediaBlockModal` (see `@triniti/cms/plugins/blocksmith/components/instagram-media-block-modal`)
+ Node preview components (eg the `ArticlePreviewModal`, see `@triniti/cms/plugins/news/components/article-preview-modal`). When used in a preview component, it is retrieved by the `resolver`'s `getPreview` function (see `@triniti/cms/plugins/blocksmith/resolver.js`).

### Required Props
+ `block` - A `instagram-media-block` block (uses mixin `triniti:canvas:mixin:instagram-media-block`).

### FYI
+ See the [Triniti instagram media block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/instagram-media-block).
+ See the [Instagram embed docs](https://www.instagram.com/developer/embedding/).
+ See the [react-instagram-embed](https://github.com/sugarshin/react-instagram-embed) docs.
